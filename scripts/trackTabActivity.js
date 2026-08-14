const LOG_KEY = "tabActivityLog";
const MAX_LOG_LENGTH = 300;

export function initTabActivityTracking() {
  chrome.tabs.onCreated.addListener((tab) => {
    logTabCreated(tab.id, tab.url, tab.title);
  });

  // Tab creation often fires before the URL/title are known (e.g. new tab
  // page navigating to the real destination) - patch the log entry once
  // the page finishes loading.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      patchTabEntry(tabId, tab.url, tab.title);
    }
  });
}

async function logTabCreated(tabId, url, title) {
  const { [LOG_KEY]: log = [] } = await chrome.storage.local.get(LOG_KEY);

  log.push({
    tabId,
    url: url || "",
    title: title || "",
    timestamp: Date.now()
  });

  if (log.length > MAX_LOG_LENGTH) {
    log.splice(0, log.length - MAX_LOG_LENGTH);
  }

  await chrome.storage.local.set({ [LOG_KEY]: log });
}

async function patchTabEntry(tabId, url, title) {
  const { [LOG_KEY]: log = [] } = await chrome.storage.local.get(LOG_KEY);

  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].tabId === tabId) {
      log[i].url = url || log[i].url;
      log[i].title = title || log[i].title;
      break;
    }
  }

  await chrome.storage.local.set({ [LOG_KEY]: log });
}

/**
 * Returns the tabs opened immediately before and after the given tab,
 * in creation order. Either may be null (e.g. tab was open before the
 * extension started tracking, or it's the very first/last tab created).
 * The returned entries reflect title/url at time of tracking, so they're
 * still useful even if that tab has since been closed.
 */
export async function getAdjacentTabActivity(tabId) {
  const { [LOG_KEY]: log = [] } = await chrome.storage.local.get(LOG_KEY);

  let index = -1;
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].tabId === tabId) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    return { before: null, after: null };
  }

  return {
    before: index > 0 ? log[index - 1] : null,
    after: index < log.length - 1 ? log[index + 1] : null
  };
}
