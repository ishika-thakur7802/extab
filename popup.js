document.addEventListener('DOMContentLoaded', () => {

  const readTabsBtn = document.getElementById('readTabsBtn');
  const duplicateTabsBtn= document.getElementById('duplicateTabsBtn');

  readTabsBtn.addEventListener('click', () => {

    chrome.runtime.sendMessage(
      { action: "getTabs" },

      (response) => {

        const tabList = document.getElementById('tabList');

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

          // Clear old list
          duplicateTabsList.innerHTML = "";

          if (response.duplicateTabs.length === 0) {

              const li = document.createElement('li');
              li.textContent = "No duplicate tabs found";
              duplicateTabsList.appendChild(li);

          } else {

              response.duplicateTabs.forEach(tab => {

                  const li = document.createElement('li');
                  li.textContent = tab.title;

                  duplicateTabsList.appendChild(li);
              });

          }
        }
      );
    });
});