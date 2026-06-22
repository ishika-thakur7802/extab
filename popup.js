document.addEventListener('DOMContentLoaded', () => {
  const readTabsBtn = document.getElementById('readTabsBtn');
  const duplicateTabsBtn= document.getElementById('duplicateTabsBtn');
//  const idleTabsBtn = document.getElementById('idleTabsBtn');
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
              const deleteDuplicateBtn= document.createElement('button');
              deleteDuplicateBtn.textContent = "Delete Duplicate Tabs"
              duplicateTabsList.appendChild(deleteDuplicateBtn);
              deleteDuplicateBtn.addEventListener('click', () => {

                      chrome.runtime.sendMessage(
                        { action: "closeDuplicateTabs" },

                        (response) => {

                          const deleteCount = document.getElementById('deleteCount');
                          deleteCount.textContent = `Duplicate Tabs Deleted: ${response.duplicateTabs.length}`;         }
                      );
                    });
              response.duplicateTabs.forEach(tab => {

                  const li = document.createElement('li');
                  li.textContent = tab.title;


                duplicateTabsList.appendChild(li);
              });

          }
        }
      );
    });
//    idleTabsBtn.addEventListener('click', () => {
//        chrome.runtime.sendMessage(
//          { action: "getIdleTabs" },
//          (response) => {
//            if (!response || !Array.isArray(response.idleTabs)) {
//              console.error('No response from background', chrome.runtime.lastError);
//              return;
//            }
//             const idleTabsList = document.getElementById('idleTabsList');
//                    const idleCount = document.getElementById('idleCount');
//                    idleCount.textContent = `Idle tabs: ${response.idleTabs.length}`;
//                    idleTabsList.innerHTML = "";
//
//                    if (response.idleTabs.length === 0) {
//                      const li = document.createElement('li');
//                      li.textContent = "No idle tabs found";
//                      idleTabsList.appendChild(li);
//                    } else {
//                      response.idleTabs.forEach(tab => {
//                        const li = document.createElement('li');
//                        li.textContent = `${tab.title} (${tab.url})`;
//                        idleTabsList.appendChild(li);
//
//                        });
//                    }
            }
        );
        });


});