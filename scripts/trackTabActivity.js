//export function initTabActivityTracking() {
//  // Listen for tab activation (when user switches to a tab)
//  chrome.tabs.onActivated.addListener((activeInfo) => {
//    const { tabId } = activeInfo;
//    chrome.tabs.get(tabId, (tab) => {
//      if (chrome.runtime.lastError) return;
//
//      const tabActivityMap = {
//        [tabId]: {
//          id: tabId,
//          title: tab.title,
//          url: tab.url,
//          lastAccessed: Date.now()
//        }
//      };
//
//      chrome.storage.local.set(tabActivityMap);
//    });
//
//     // Listen for tab creation - mark as newly accessed
//      chrome.tabs.onCreated.addListener((tab) => {
//        const tabActivityMap = {
//          [tab.id]: {
//            id: tab.id,
//            title: tab.title,
//            url: tab.url,
//            lastAccessed: Date.now()
//          }
//        };
//
//        chrome.storage.local.set(tabActivityMap);
//      });
//
//       // Listen for tab removal - clean up storage
//        chrome.tabs.onRemoved.addListener((tabId) => {
//          chrome.storage.local.remove(String(tabId));
//        });
//      });
//
//      // Get all tracked tabs from storage
//      export async function getTrackedTabs() {
//        return new Promise((resolve) => {
//          chrome.storage.local.get(null, (items) => {
//            const tabs = Object.values(items).filter(item => item.id && item.lastAccessed);
//            resolve(tabs);
//          });
//        });
//      }
//  });