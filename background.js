import { readTabs } from './readTabs.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getTabs") {

    getAllTabs().then((tabs) => {
      sendResponse({ tabs });
    });

    return true;
  }
});