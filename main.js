chrome.tabs.executeScript(null, {
  code: "document.body.appendChild(document.createElement('script')).src='" +
    chrome.extension.getURL("script.js") +"';"
}, null);
