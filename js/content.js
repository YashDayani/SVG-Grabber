function collectSVGs() {
  const svgElements = document.querySelectorAll('svg');
  const svgData = [];

  svgElements.forEach((svgElement) => {
    const svgXML = new XMLSerializer().serializeToString(svgElement);
    svgData.push(svgXML);
  });
  console.log(svgData);
  return svgData;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "grabSVGs") {
    const svgData = collectSVGs();
    sendResponse({ svgData: svgData });
  }
});
