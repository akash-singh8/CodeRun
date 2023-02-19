chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "getSelectedText") {
    sendResponse(window.getSelection().toString());
  }
});
