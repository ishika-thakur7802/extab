// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const readTabsBtn = document.getElementById('readTabsBtn');
  const duplicateTabsBtn = document.getElementById('duplicateTabsBtn');

  // Defensive: ensure required DOM nodes exist
  const tabList = document.getElementById('tabList');
  const tabCount = document.getElementById('tabCount');
  const duplicateTabsList = document.getElementById('duplicateTabsList');
  const duplicateCount = document.getElementById('duplicateCount');
  const deleteCount = document.getElementById('deleteCount');

  if (!readTabsBtn || !duplicateTabsBtn || !tabList || !tabCount || !duplicateTabsList || !duplicateCount || !deleteCount) {
    console.error('Popup missing required elements', { readTabsBtn, duplicateTabsBtn, tabList, tabCount, duplicateTabsList, duplicateCount, deleteCount });
    return;
  }

  readTabsBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'getTabs' }, (response) => {
      if (!response || !Array.isArray(response.tabs)) {
        console.error('No tabs response from background', chrome.runtime.lastError, response);
        tabCount.textContent = 'Error reading tabs';
        tabList.innerHTML = '';
        return;
      }

      tabCount.textContent = `Number of Open Tabs: ${response.tabs.length}`;
      tabList.innerHTML = '';

      response.tabs.forEach(tab => {
        const li = document.createElement('li');
        li.textContent = tab.title || tab.url || '(no title)';
        tabList.appendChild(li);
      });
    });
  });

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
        chrome.runtime.sendMessage({ action: 'closeDuplicateTabs' }, (closeResp) => {
          if (!closeResp || !Array.isArray(closeResp.duplicateTabs)) {
            console.error('No closeDuplicateTabs response', chrome.runtime.lastError, closeResp);
            deleteCount.textContent = 'Error deleting duplicates';
            return;
          }
          deleteCount.textContent = `Duplicate Tabs Deleted: ${closeResp.duplicateTabs.length}`;
          // Refresh duplicate list UI
          duplicateTabsList.innerHTML = '';
          const li = document.createElement('li');
          li.textContent = `Closed ${closeResp.duplicateTabs.length} tabs`;
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
});