let fetchedSVGs = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeSVGs') {
    fetchedSVGs = message.svgArray;
    sendResponse({ status: 'success' });
  } else if (message.action === 'getSVGs') {
    sendResponse({ svgArray: fetchedSVGs });
  }
});