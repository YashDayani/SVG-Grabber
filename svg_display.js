document.addEventListener('DOMContentLoaded', function() {
  const svgContainer = document.getElementById('svg-container');

  // Retrieve the fetched SVGs from the service worker
  chrome.runtime.sendMessage({ action: 'getSVGs' }, (response) => {
    const svgArray = response.svgArray;

    if (svgArray && svgArray.length > 0) {
      svgArray.forEach((svgString) => {
        const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
        svgContainer.innerHTML += `
          <div class="card">
            <div class="svg_place">${svgElement.outerHTML}</div>
            <div class="btn_place">
              <button class="svg_copy">Copy</button>
              <button class="svg_download">Download</button>
            </div>
          </div>
        `;
      });
    } else {
      svgContainer.textContent = 'No SVGs fetched.';
    }
  });
});