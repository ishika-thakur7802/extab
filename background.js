import { readTabs } from './scripts/readTabs.js';
import { detectDuplicate } from './scripts/detectDuplicate.js';
import { closeDuplicateTabs } from './scripts/closeDuplicateTabs.js';
//import { getIdleTabs } from './scripts/detectStaleTabs.js';
//import { initTabActivityTracking } from './scripts/trackTabActivity.js';

//initTabActivityTracking();

//// Set up alarm to check for idle tabs every 5 minutes
//chrome.alarms.create('checkIdleTabs', { periodInMinutes: 5 });
//
//// Listen for the alarm
//chrome.alarms.onAlarm.addListener((alarm) => {
//  if (alarm.name === 'checkIdleTabs') {
//    checkAndNotifyIdleTabs();
//  }
//});
//
//async function checkAndNotifyIdleTabs() {
//  const idleTabs = await getIdleTabs();
//
//  if (idleTabs && idleTabs.length > 0) {
//    const tabTitles = idleTabs.slice(0, 5).map(t => t.title || 'Untitled').join('\n');
//    const count = idleTabs.length;
//    const moreText = count > 5 ? `\n... and ${count - 5} more` : '';
//
//    chrome.notifications.create('idleTabsNotification', {
//      type: 'basic',
//      iconUrl: 'images/icon-128.png',
//      title: `${count} Idle Tab${count > 1 ? 's' : ''} Detected`,
//      message: `These tabs haven't been accessed in 3+ hours:\n${tabTitles}${moreText}`,
//      priority: 1
//    });
//  }
//}

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
//   if (request.action === "getIdleTabs") {
//        getIdleTabs().then((idleTabs) => {
//          sendResponse({ idleTabs });
//        });
//        return true;
//      }


});