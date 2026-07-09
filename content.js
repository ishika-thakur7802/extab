console.log("content.js injected");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "extractPage") {

   const text = document.body.innerText
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 8000);

        sendResponse({
            text
        });

    }

});