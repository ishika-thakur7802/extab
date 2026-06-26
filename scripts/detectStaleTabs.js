export async function detectStaleTabs(){
	const tabs= await chrome.tabs.query({});
	const staleTabsList = [];

	for(let i=0; i<tabs.length; i++){
	    if(tabs[i].lastAccessed > 7200000){

		   staleTabsList.push({
                  title: tabs[i].title,
                  id: tabs[i].id,
                  url: tabs[i].url
});
}
}

}