
// Sends a message when a link with the classes game-item and
// mobile - not - playable is clicked. Need to figure out how
// to get this to work for all game-item classes.
document.addEventListener('click', function (event) {
  const targetLink = event.target.closest('.game-item.mobile-not-playable a, .game-item.other-category-class a');
const port = chrome.runtime.connect({ name: 'content-script' });
port.postMessage({ action: 'interceptedClick', targetLinkHref: targetLink.href });

  if (targetLink) {
    event.preventDefault();
    console.log('Link clicked. Sending message to background.');
    chrome.runtime.sendMessage({ action: 'interceptedClick', targetLinkHref: targetLink.href });
  }
});
