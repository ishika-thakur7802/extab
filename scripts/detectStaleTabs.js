export async function detectStaleTabs() {
   const tabs= await chrome.tabs.query({lastAccessed: true});
    const staleTabsList = [];
    const currentTime = Date.now();
