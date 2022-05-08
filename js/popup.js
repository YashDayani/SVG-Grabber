document.addEventListener('DOMContentLoaded', function () {
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
      chrome.tabs.create({ url: chrome.runtime.getURL('/html/svg_display.html') });
    } catch (err) {
      console.log(err, "Error in popup script");
    }
  });
});



function fetchSVGs() {
  const svgSet = new Set(); // Set to store unique SVG strings

  // Function to fetch SVG content from an image URL
  function fetchSVGFromURL(url) {
    return fetch(url)
      .then(response => response.text())
      .catch(error => {
        console.error('Error fetching SVG:', error);
        return null; // Return null in case of error
      });
  }

  // Function to clean SVG element attributes
  // Function to clean SVG element attributes
function cleanSVG(svgElement) {
  svgElement.removeAttribute('height');
  svgElement.removeAttribute('width');
  svgElement.removeAttribute('style');
  svgElement.removeAttribute('id');
  svgElement.removeAttribute('class');

  // Define the xlink namespace if it's missing on the SVG element
  if (!svgElement.hasAttributeNS('http://www.w3.org/2000/xmlns/', 'xlink') && !svgElement.hasAttribute('xmlns:xlink')) {
    svgElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/2000/svg');
  }

  // Define the xlink namespace for any <use> elements with xlink:href attribute
  const useElements = svgElement.querySelectorAll('use');
  useElements.forEach(useElement => {
    if (!useElement.hasAttributeNS('http://www.w3.org/2000/xmlns/', 'xlink') && !useElement.getAttribute('xmlns:xlink')) {
      useElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    }
  });

  // Set the xmlns attribute to "http://www.w3.org/2000/svg" if it's missing
  if (!svgElement.hasAttribute('xmlns') || svgElement.getAttribute('xmlns') !== 'http://www.w3.org/2000/svg') {
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
}

// Iterate over each SVG element on the page
Array.from(document.querySelectorAll('svg')).forEach(svg => {
  const svgClone = svg.cloneNode(true);
  cleanSVG(svgClone); // Clean SVG element attributes

  const svgString = svgClone.outerHTML;

  // Check if the SVG string is not empty and doesn't contain <parsererror>, or other unwanted elements
  if (svgString.trim().length > 0 && !svgString.includes('href="/')

  ) {
    svgSet.add(svgString); // Add the SVG string to the Set
  }
});


  // Iterate over each SVG element on the page
  Array.from(document.querySelectorAll('svg')).forEach(svg => {
    const svgClone = svg.cloneNode(true);
    cleanSVG(svgClone); // Clean SVG element attributes

    const svgString = svgClone.outerHTML;

    // Check if the SVG string is not empty and doesn't contain <parsererror>, or other unwanted elements
    if (svgString.trim().length > 0 && !svgString.includes('href="/')) {
      svgSet.add(svgString); // Add the SVG string to the Set
    }
  });

  // Array to store promises for fetching SVG content from img URLs
  const imgPromises = [];

  // Iterate over each <img> element on the page
  Array.from(document.querySelectorAll('img')).forEach(img => {
    const src = img.getAttribute('src');

    // Check if the image source ends with .svg
    if (src && src.endsWith('.svg')) {
      imgPromises.push(
        fetchSVGFromURL(src)
          .then(svgContent => {
            if (svgContent !== null) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(svgContent, 'image/svg+xml');
              const svgElement = doc.documentElement;
              cleanSVG(svgElement); // Clean SVG element attributes
              svgSet.add(svgElement.outerHTML); // Add the SVG content to the Set
            }
          })
      );
    }
  });

  // Wait for all promises to resolve using Promise.all()
  return Promise.all(imgPromises)
    .then(() => {
      // Convert the Set to an array and return
      const svgArray = Array.from(svgSet);
      return svgArray;
    });
}
