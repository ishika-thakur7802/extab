import { readTabs } from './scripts/readTabs.js';
import { detectDuplicate } from './scripts/detectDuplicate.js';
import { closeDuplicateTabs } from './scripts/closeDuplicateTabs.js';
import { detectStaleTabs } from './scripts/detectStaleTabs.js';
import { initTabActivityTracking, getAdjacentTabActivity } from './scripts/trackTabActivity.js';
import { extractPageText, generateTabSummary } from './scripts/aiReview.js';

initTabActivityTracking();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getTabs") {

    readTabs().then((tabs) => {
      sendResponse({ tabs });
    });

    return true;
  }

  if (request.action === "detectDuplicateTabs") {

    detectDuplicate().then((duplicateTabs) => {
      sendResponse({ duplicateTabs });
    });

    return true;
  }

  if (request.action === "closeDuplicateTabs") {

    closeDuplicateTabs().then((duplicateTabs) => {
      sendResponse({ duplicateTabs });
    });

    return true;
  }

  if (request.action === "getStaleTabs") {

    detectStaleTabs().then((staleTabs) => {
      sendResponse({ staleTabs });
    });

    return true;
  }

  if (request.action === "reviewTab") {

    (async () => {
      const { tab } = request;

      if (!tab || !tab.id) {
        sendResponse({ ok: false, error: "invalid_tab" });
        return;
      }

      const [pageText, adjacency] = await Promise.all([
        extractPageText(tab.id),
        getAdjacentTabActivity(tab.id)
      ]);

      const result = await generateTabSummary({
        tab,
        pageText,
        before: adjacency.before,
        after: adjacency.after,
        idleTime: tab.idleTime
      });

      sendResponse(result);
    })();

    return true;
  }

});
