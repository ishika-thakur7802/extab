document.addEventListener('DOMContentLoaded', () => {
  const readTabsBtn = document.getElementById('readTabsBtn');
  const duplicateTabsBtn = document.getElementById('duplicateTabsBtn');
  const staleTabsBtn= document.getElementById('staleTabsBtn');
  const tabList = document.getElementById('tabList');

  const tabCount = document.getElementById('tabCount');
  const duplicateTabsList = document.getElementById('duplicateTabsList');
  const duplicateCount = document.getElementById('duplicateCount');
  const deleteCount = document.getElementById('deleteCount');
  const staleCount= document.getElementById('staleCount');
  const staleCardContainer = document.getElementById("staleCardContainer");

  if (!readTabsBtn || !duplicateTabsBtn || !staleTabsBtn) {
    console.error('Popup missing required elements');
    return;
  }



  readTabsBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'getTabs' }, (response) => {
      if (!response || !Array.isArray(response.tabs)) {
        console.error('No tabs response from background', chrome.runtime.lastError, response);
        if(tabCount) tabCount.textContent = 'Error reading tabs';
        if(tabList) tabList.innerHTML = '';
        return;
      }

      if (tabCount) tabCount.textContent = `Number of Open Tabs: ${response.tabs.length}`;
      if (tabList) tabList.innerHTML = '';

      response.tabs.forEach(tab => {
        const li = document.createElement('li');
        li.textContent = tab.title || tab.url || '(no title)';
        if (tabList) tabList.appendChild(li);
      });
    });
  });

//  readTabsBtn.addEventListener('dblclick', () => {
//    tabList.innerHTML = '';
//    tabCount.textContent = '';
//  }

  duplicateTabsBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'detectDuplicateTabs' }, (response) => {
      if (!response || !Array.isArray(response.duplicateTabs)) {
        console.error('No duplicateTabs response from background', chrome.runtime.lastError, response);
        duplicateCount.textContent = 'Error detecting duplicates';
        duplicateTabsList.innerHTML = '';
        return;
      }

      duplicateCount.textContent = `Duplicate tabs: ${response.duplicateTabs.length}`;
      duplicateTabsList.innerHTML = '';

      if (response.duplicateTabs.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No duplicate tabs found';
        duplicateTabsList.appendChild(li);
        deleteCount.textContent = '';
        return;
      }

      // Create delete button and attach listener right after creation
      const deleteDuplicateBtn = document.createElement('button');
      deleteDuplicateBtn.textContent = 'Delete Duplicate Tabs';
      deleteDuplicateBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'closeDuplicateTabs' }, (response) => {
          if (!response || !Array.isArray(response.duplicateTabs)) {
            console.error('No closeDuplicateTabs response', chrome.runtime.lastError, response);
            deleteCount.textContent = 'Error deleting duplicates';
            return;
          }
          deleteCount.textContent = `Duplicate Tabs Deleted: ${response.duplicateTabs.length}`;
          // Refresh duplicate list UI
          duplicateTabsList.innerHTML = '';
          const li = document.createElement('li');
          li.textContent = `Closed ${response.duplicateTabs.length} tabs`;
          duplicateTabsList.appendChild(li);
        });
      });
      duplicateTabsList.appendChild(deleteDuplicateBtn);

      // List duplicates
      response.duplicateTabs.forEach(tab => {
        const li = document.createElement('li');
        li.textContent = tab.title || tab.url || '(no title)';
        duplicateTabsList.appendChild(li);
      });


    });
  });
  function displayCard(tab) {
    const hours = Math.floor(tab.idleTime / 3600000);
    const minutes = Math.floor((tab.idleTime % 3600000) / 60000);
    staleCardContainer.innerHTML = `
    <div class="tab-card">

        <h3>${tab.title}</h3>

        <p>${new URL(tab.url).hostname}</p>

        <p>Idle for ${hours}h ${minutes}m</p>


    </div>
    `;
  }
  staleTabsBtn.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'getStaleTabs'}, (response)=>{

      if (!response || !Array.isArray(response.staleTabs)) {
              console.error('No tabs response from background', chrome.runtime.lastError, response);
              staleCount.textContent = 'Error reading tabs';
              staleCardContainer.innerHTML = '';
              return;
            }
    		staleCount.textContent= `Number of Idle Tabs: ${response.staleTabs.length}`;
    		staleCardContainer.innerHTML = '';

                  if (response.staleTabs.length === 0) {
                      staleCardContainer.innerHTML = `
                          <div class="tab-card">
                              <h3>🎉 No Idle Tabs</h3>
                              <p>Your tabs are nice and clean.</p>
                          </div>
                      `;
                      return;
                  }

        displayCard(response.staleTabs[0]);

//  	const li= document.createElement('li');
//  	const title= tab.title || tab.url || '(no title)';
//  	li.textContent= li.textContent = `${title} - Idle for ${Math.floor(tab.idleTime / 86400000)} days ${Math.floor((tab.idleTime % 86400000) / 3600000)} hours`;
//  	staleTabsList.appendChild(li);

    });
});
});