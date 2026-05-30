import { readTabs } from './scripts/readTabs.js';
import { detectDuplicate } from './scripts/detectDuplicate.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getTabs") {

    readTabs().then((tabs) => {
      sendResponse({ tabs });
    });

    return true;
  }

   if (request.action === "detectDuplicateTabs") {

      detectDuplicate().then((tabs) => {
        sendResponse({ tabs });
      });

      return true;
    }
});