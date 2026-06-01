export async function detectDuplicate(){
    const tabs = await chrome.tabs.query({});
    const duplicateTabsList = [];

    for (let i = 0; i < tabs.length; i++) {
        for (let j = i + 1; j < tabs.length; j++) {
            if (tabs[i].url === tabs[j].url) {
                 duplicateTabsList.push({
                     title: tabs[j].title,
                     id: tabs[j].id;
                     url: tabs[j].url
                 });
            }
        }
    }
    return duplicateTabsList;
}