// Background script for the extension

let isRedirectAllowed = false;
let targetLinkHref = '';

// This is meant to get the signal for when an answer is submitted to allow redirect
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Message received in background:', request);

  if (request.action === 'interceptedClick') {
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   console.log('Sending openPopup message to tab:', tabs[0].id);
    //   chrome.tabs.sendMessage(tabs[0].id, { action: 'openPopup' });
    //   targetLinkHref = request.targetLinkHref;
    // });
    chrome.tabs.executeScript(null, { file: "popup.js" });
  } else if (request.action === 'proceedWithRedirect') {
    isRedirectAllowed = true;
    console.log('Redirect is allowed.');
  }
});

// This should redirect the page to the link that was clicked
chrome.webNavigation.onCompleted.addListener(function (details) {
  if (isRedirectAllowed && details.tabId) {
    isRedirectAllowed = false;
    console.log('Redirecting to:', targetLinkHref);
    chrome.tabs.update(details.tabId, { url: targetLinkHref });
  }
});