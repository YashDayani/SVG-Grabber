document.addEventListener('DOMContentLoaded', function() {
  const grabSVGsButton = document.getElementById('grabSVGs');

  grabSVGsButton.addEventListener('click', async () => {
    try {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const svgElements = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: fetchSVGs,
      });

      const svgArray = svgElements[0].result;
      console.log('Fetched SVGs:', svgArray);

      // Store the fetched SVGs in the service worker
      chrome.runtime.sendMessage({ action: 'storeSVGs', svgArray });

      // Redirect to svg_display.html
      chrome.tabs.create({ url: chrome.runtime.getURL('svg_display.html') });
    } catch (err) {
      console.log(err, "Error in popup script");
    }
  });
});

// Helper function to fetch SVG elements from the current tab
// Helper function to fetch SVG elements from the current tab
// Helper function to fetch SVG elements from the current tab
// function fetchSVGs() {
//   const svgElements = Array.from(document.querySelectorAll('svg'))
//     .map(svg => {
//       const svgClone = svg.cloneNode(true);
//       svgClone.removeAttribute('height');
//       svgClone.removeAttribute('width');
//       svgClone.removeAttribute('style');
//       const svgString = svgClone.outerHTML;

//       // Check if the SVG string is not empty and doesn't contain <parsererror>
//       if (svgString.trim().length > 0 && !svgString.includes('<parsererror')) {
//         return svgString;
//       }
//     })
//     .filter(svgString => svgString !== undefined); // Filter out undefined values

//   return svgElements;
// }




function fetchSVGs() {
  const svgSet = new Set(); // Create a Set to store unique SVG strings

  // Iterate over each SVG element on the page
  Array.from(document.querySelectorAll('svg')).forEach(svg => {
    const svgClone = svg.cloneNode(true);

    // Remove attributes that might cause issues or are unnecessary
    svgClone.removeAttribute('height');
    svgClone.removeAttribute('width');
    svgClone.removeAttribute('style');
    svgClone.removeAttribute('id');
    svgClone.removeAttribute('class');

    // Define the xlink namespace if it's missing
    if (!svgClone.hasAttributeNS('http://www.w3.org/2000/xmlns/', 'xlink')) {
      svgClone.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    }

    const svgString = svgClone.outerHTML;

    // Check if the SVG string is not empty and doesn't contain <parsererror>, or other unwanted elements
    if (
      svgString.trim().length > 0 &&
      !svgString.includes('<parsererror') &&
      !svgString.includes('<defs')
    ) {
      svgSet.add(svgString); // Add the SVG string to the Set
    }
  });

  // Convert the Set back to an array and return
  return Array.from(svgSet);
}

