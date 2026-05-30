document.addEventListener('DOMContentLoaded', () => {

  const readTabsBtn = document.getElementById('readTabsBtn');

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
});