// Background script for the extension

// This listens for a message from content.js
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === 'content-script');
  port.onMessage.addListener(function (msg) {
    console.log('Message received in background:', msg);
    // Note: This is probably where I need to fix the popup not working...
  });
});

let isRedirectAllowed = false;
let targetLinkHref = '';

// This is meant to get the signal for when an answer is submitted to allow redirect
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Message received in background:', request);

  if (request.action === 'interceptedClick') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('Sending openPopup message to tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, { action: 'openPopup' });
      targetLinkHref = request.targetLinkHref;
    });
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

