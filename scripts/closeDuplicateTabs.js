import { detectDuplicate } from './detectDuplicate.js';

export async function closeDuplicateTabs(){
    const duplicateTabs = await detectDuplicate();
    if(duplicateTabs.length > 0){
        for(const tab of duplicateTabs){
            chrome.tabs.remove(tab.id);
        }
    }

    return duplicateTabs;
}
