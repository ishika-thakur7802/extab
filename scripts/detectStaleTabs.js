export async function detectStaleTabs(){
	const tabs= await chrome.tabs.query({});
	const staleTabsList = [];
    const currentTime = Date.now();
	for(let i=0; i<tabs.length; i++){
	    if((currentTime - tabs[i].lastAccessed) > 7200000){
	       const idleTime = currentTime - tabs[i].lastAccessed;

		   staleTabsList.push({
                  title: tabs[i].title,
                  id: tabs[i].id,
                  url: tabs[i].url,
                  idleTime: idleTime
});
}
}
return staleTabsList;

}