// Select all cards
const cards = document.querySelectorAll(".card");

// Loop through each card
cards.forEach(card => {
    // Select copy and download buttons within the current card
    const copyButton = card.querySelector(".svg_copy");
    const downloadButton = card.querySelector(".svg_download");

    // Add event listener to the copy button
    copyButton.addEventListener("click", () => {
        // Get the SVG content within the current card
        const svgElement = card.querySelector('.svg_place svg');
        const svgContent = svgElement.outerHTML;

        // Create a textarea element to hold the SVG content
        const textarea = document.createElement('textarea');
        textarea.value = svgContent;
        document.body.appendChild(textarea);

        // Select and copy the SVG content
        textarea.select();
        document.execCommand('copy');

        // Remove the textarea
        document.body.removeChild(textarea);

        // Notify the user
        alert('SVG copied to clipboard!');
    });

    // Add event listener to the download button
    downloadButton.addEventListener("click", () => {
        // Get the SVG element within the current card
        const svgElement = card.querySelector('.svg_place svg');

        // Create a Blob URL for the SVG content
        const svgBlob = new Blob([svgElement.outerHTML], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = svgUrl;
        a.download = 'image.svg';

        // Programmatically click the anchor element to initiate download
        document.body.appendChild(a);
        a.click();

        // Remove the anchor element
        document.body.removeChild(a);
        URL.revokeObjectURL(svgUrl);
    });
});
