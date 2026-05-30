export async function detectDuplicate(){
    const duplicateTabs = await chrome.tabs.query({});
    const duplicateTabsList = [];

    duplicateTabs.map(tab => ({{
        id: tab.id,
        title: tab.title,
        url: tab.url
      }));

    for (let i = 0; i < duplicateTabs.length; i++) {
        for (let j = i + 1; j < duplicateTabs.length; j++) {
            if (duplicateTabs[i].url === duplicateTabs[j].url) {
                return true;
                duplicateTabsList.push(duplicateTabs[i].title);
            }
        }
    }
}