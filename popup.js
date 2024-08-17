async function getCurrentTab()
let tab = await getCurrentTab();

document.addEventListener('DOMContentLoaded', function () {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ["boost_teachable.js"]
    });    
}, false);
