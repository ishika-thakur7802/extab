import { readTabs } from './scripts/readTabs.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getTabs") {

    readTabs().then((tabs) => {
      sendResponse({ tabs });
    });

    return true;
  }
});