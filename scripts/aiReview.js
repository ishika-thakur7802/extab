const API_KEY_STORAGE = "geminiApiKey";
// Google retired the old generateContent REST endpoint for new API keys in
// favor of the Interactions API (May 2026), and separately restricts new
// API keys from using the 2.x model family - gemini-2.5-flash comes back
// "not_found" for new keys even though it still shows up in docs/listings.
// gemini-3.5-flash-lite is the current cheapest/fastest stable model that
// new keys can actually use. See:
// https://ai.google.dev/gemini-api/docs/migrate-to-interactions
// https://ai.google.dev/gemini-api/docs/models
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const INTERACTIONS_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

const SYSTEM_INSTRUCTION =
  "You help users quickly decide whether to keep or close a browser tab by summarizing why they likely opened it. Answer in max 2 sentences, no preamble.";

export async function getStoredApiKey() {
  const { [API_KEY_STORAGE]: key } = await chrome.storage.local.get(API_KEY_STORAGE);
  return key || "";
}

export async function setStoredApiKey(key) {
  await chrome.storage.local.set({ [API_KEY_STORAGE]: key });
}

/**
 * Pulls visible text out of a tab. Returns null (rather than throwing) for
 * pages the extension can't script into - chrome://, the Web Store,
 * PDF viewers, etc - so the caller can still generate a summary from
 * title/url alone.
 */
export async function extractPageText(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });
  } catch (err) {
    return null;
  }

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: "extractPage" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        resolve(null);
        return;
      }
      resolve(response.text || null);
    });
  });
}

function describeTab(tab) {
  if (!tab) return "(none)";
  return `"${tab.title || "Untitled"}" - ${tab.url || "no URL"}`;
}

/**
 * Pulls the generated text out of an Interactions API response. The REST
 * response doesn't include the SDK's output_text convenience field, so we
 * walk steps[] for the model_output step's text content ourselves.
 */
function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const steps = Array.isArray(data?.steps) ? data.steps : [];
  const text = steps
    .filter(step => step.type === "model_output")
    .flatMap(step => Array.isArray(step.content) ? step.content : [])
    .filter(block => block.type === "text" && typeof block.text === "string")
    .map(block => block.text)
    .join("")
    .trim();

  return text || null;
}

export async function generateTabSummary({ tab, pageText, before, after, idleTime }) {
  const apiKey = await getStoredApiKey();
  if (!apiKey) {
    return { ok: false, error: "no_api_key" };
  }

  const hours = Math.floor((idleTime || 0) / 3600000);
  const minutes = Math.floor(((idleTime || 0) % 3600000) / 60000);

  const input = `A browser tab has been idle for ${hours}h ${minutes}m. Using the tab's own content and the tabs the user opened immediately before and after it (for context on what they were doing at the time), guess why the user likely opened this tab, and whether it looks safe to close or worth keeping.

Tab being reviewed: ${describeTab(tab)}
Tab content excerpt: ${pageText ? pageText.substring(0, 3000) : "(no content available)"}

Tab opened immediately before this one: ${describeTab(before)}
Tab opened immediately after this one: ${describeTab(after)}`;

  try {
    const res = await fetch(INTERACTIONS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        input,
        system_instruction: SYSTEM_INSTRUCTION,
        generation_config: {
          max_output_tokens: 150
        }
      })
    });

    const data = await res.json().catch(() => null);

    // The Interactions API can signal an error either via a non-2xx HTTP
    // status (code as a number, e.g. 429) or, apparently, via a 2xx
    // response body containing an `error` object with a *string* code
    // (e.g. "not_found") - handle both shapes rather than trusting res.ok.
    const err = data?.error;
    if (!res.ok || err) {
      const codeStr = String(err?.code ?? res.status ?? "").toLowerCase();
      const statusStr = String(err?.status ?? "").toUpperCase();
      console.error("Gemini request failed", res.status, data);

      if (codeStr === "429" || statusStr === "RESOURCE_EXHAUSTED" || codeStr === "resource_exhausted") {
        return { ok: false, error: "quota_exceeded" };
      }
      if (codeStr === "404" || codeStr === "not_found" || statusStr === "NOT_FOUND") {
        return { ok: false, error: "model_not_found" };
      }
      if (
        codeStr === "400" || codeStr === "403" ||
        statusStr === "INVALID_ARGUMENT" || statusStr === "PERMISSION_DENIED" ||
        codeStr === "invalid_argument" || codeStr === "permission_denied"
      ) {
        return { ok: false, error: "invalid_api_key" };
      }
      return { ok: false, error: "api_error" };
    }

    if (data?.status && data.status !== "completed") {
      // e.g. "failed" or "requires_action" - not a normal successful turn.
      console.error("Interaction did not complete", data);
      return { ok: false, error: data.status === "failed" ? "blocked" : "api_error" };
    }

    const summary = extractOutputText(data);

    if (!summary) {
      return { ok: false, error: "empty_response" };
    }

    return { ok: true, summary };
  } catch (err) {
    console.error("Network error calling Gemini", err);
    return { ok: false, error: "network_error" };
  }
}