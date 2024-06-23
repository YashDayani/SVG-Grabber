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

      chrome.runtime.sendMessage({ action: 'storeSVGs', svgArray });

      chrome.tabs.create({ url: chrome.runtime.getURL('/html/svg_display.html') });
    } catch (err) {
      console.log(err, "Error in popup script");
    }
  });
});



function fetchSVGs() {
  const svgSet = new Set();

  function fetchSVGFromURL(url) {
    return fetch(url)
      .then(response => response.text())
      .catch(error => {
        console.error('Error fetching SVG:', error);
        return null;
      });
  }

function cleanSVG(svgElement) {
  svgElement.removeAttribute('height');
  svgElement.removeAttribute('width');
  svgElement.removeAttribute('style');
  svgElement.removeAttribute('id');
  svgElement.removeAttribute('class');

  if (!svgElement.hasAttributeNS('http://www.w3.org/2000/xmlns/', 'xlink') && !svgElement.hasAttribute('xmlns:xlink')) {
    svgElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/2000/svg');
  }

  const useElements = svgElement.querySelectorAll('use');
  useElements.forEach(useElement => {
    if (!useElement.hasAttributeNS('http://www.w3.org/2000/xmlns/', 'xlink') && !useElement.getAttribute('xmlns:xlink')) {
      useElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    }
  });

  if (!svgElement.hasAttribute('xmlns') || svgElement.getAttribute('xmlns') !== 'http://www.w3.org/2000/svg') {
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
}

Array.from(document.querySelectorAll('svg')).forEach(svg => {
  const svgClone = svg.cloneNode(true);
  cleanSVG(svgClone);

  const svgString = svgClone.outerHTML;

  if (svgString.trim().length > 0 && !svgString.includes('href="/')

  ) {
    svgSet.add(svgString);
  }
});


  Array.from(document.querySelectorAll('svg')).forEach(svg => {
    const svgClone = svg.cloneNode(true);
    cleanSVG(svgClone);

    const svgString = svgClone.outerHTML;

    if (svgString.trim().length > 0 && !svgString.includes('href="/')) {
      svgSet.add(svgString);
    }
  });

  const imgPromises = [];

  Array.from(document.querySelectorAll('img')).forEach(img => {
    const src = img.getAttribute('src');

    if (src && src.endsWith('.svg')) {
      imgPromises.push(
        fetchSVGFromURL(src)
          .then(svgContent => {
            if (svgContent !== null) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(svgContent, 'image/svg+xml');
              const svgElement = doc.documentElement;
              cleanSVG(svgElement);
              svgSet.add(svgElement.outerHTML);
            }
          })
      );
    }
  });

  return Promise.all(imgPromises)
    .then(() => {
      const svgArray = Array.from(svgSet);
      return svgArray;
    });
}
