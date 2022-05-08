// svg_display_script.js
document.addEventListener('DOMContentLoaded', function() {
    const svgContainer = document.getElementById('svg-container');

    // Add click event listener to each download button
    svgContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('svg_download')) {
            // Get the SVG content
            const svgContent = event.target.parentElement.previousElementSibling.innerHTML;

            // Create a blob from the SVG content
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });

            // Create a temporary anchor element
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'image.svg'; // Set the filename for the downloaded file

            // Simulate click on the anchor element to trigger download
            a.click();

            // Clean up
            URL.revokeObjectURL(a.href);
        }
    });
});


// svg_display_script.js
document.addEventListener('DOMContentLoaded', function() {
    const svgContainer = document.getElementById('svg-container');
    const clipboard = new ClipboardJS('.svg_copy', {
        text: function(trigger) {
            return trigger.parentElement.previousElementSibling.innerHTML;
        }
    });

    clipboard.on('success', function(event) {
        alert('SVG copied to clipboard!');
        event.clearSelection();
    });

    clipboard.on('error', function(event) {
        console.error('Failed to copy SVG:', event.error);
    });
});
