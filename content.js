// Guard against duplicate registration: this script is both declared as a
// content script in manifest.json (auto-injected on page load) and
// manually re-injected on demand by aiReview.js's extractPageText(), as a
// fallback for tabs that were already open before the extension loaded.
// Without this guard, repeated manual injection stacks duplicate
// onMessage listeners on long-lived tabs.
if (!window.__extabContentScriptInjected) {
  window.__extabContentScriptInjected = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractPage") {
      const text = document.body
        ? document.body.innerText.replace(/\s+/g, " ").trim().substring(0, 8000)
        : "";

      sendResponse({ text });
    }
  });
}
