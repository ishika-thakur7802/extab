// This script is injected on demand by aiReview.js when the user
// explicitly requests an AI review of a tab.
// The guard prevents duplicate message listeners if the script
// is injected more than once into the same tab.
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
