document.addEventListener('DOMContentLoaded', () => {
  let deleteDuplicateBtn;
  const readTabsBtn = document.getElementById('readTabsBtn');
  const duplicateTabsBtn= document.getElementById('duplicateTabsBtn');

  readTabsBtn.addEventListener('click', () => {

    chrome.runtime.sendMessage(
      { action: "getTabs" },

      (response) => {

        const tabList = document.getElementById('tabList');
        const tabCount = document.getElementById('tabCount');
        tabCount.textContent =
             `Number of Open Tabs: ${response.tabs.length}`;
        // Clear old list
        tabList.innerHTML = "";

        response.tabs.forEach(tab => {

          const li = document.createElement('li');

          li.textContent = tab.title;

          tabList.appendChild(li);

        });
      }
    );
  });

    duplicateTabsBtn.addEventListener('click', () => {

      chrome.runtime.sendMessage(
        { action: "detectDuplicateTabs" },

        (response) => {
          const duplicateTabsList = document.getElementById('duplicateTabsList');
          const duplicateCount = document.getElementById('duplicateCount');
          duplicateCount.textContent =
              `Duplicate tabs: ${response.duplicateTabs.length}`;
          // Clear old list
          duplicateTabsList.innerHTML = "";

          if (response.duplicateTabs.length === 0) {

              const li = document.createElement('li');
              li.textContent = "No duplicate tabs found";
              duplicateTabsList.appendChild(li);

          } else {
              deleteDuplicateBtn= document.createElement('button');
              deleteDuplicateBtn.textContent = "Delete Duplicate Tabs"
              duplicateTabsList.appendChild(deleteDuplicateBtn);
              response.duplicateTabs.forEach(tab => {

                  const li = document.createElement('li');
                  li.textContent = tab.title;


                duplicateTabsList.appendChild(li);
              });

          }
        }
      );
    });

     deleteDuplicateBtn.addEventListener('click', () => {

        chrome.runtime.sendMessage(
          { action: "closeDuplicateTabs" },

          (response) => {

            const deleteCount = document.getElementById('deleteCount');
            deleteCount.textContent = `Duplicate Tabs Deleted: ${response.duplicateTabs.length}`;         }
        );
      });
});