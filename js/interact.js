document.addEventListener('DOMContentLoaded', function () {
    const svgContainer = document.getElementById('svg-container');


    svgContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('svg_download')) {

            const svgContent = event.target.parentElement.previousElementSibling.innerHTML;
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const a = document.createElement('a');

            a.href = URL.createObjectURL(blob);
            a.download = 'image.svg';
            a.click();

            URL.revokeObjectURL(a.href);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const svgContainer = document.getElementById('svg-container');
    const clipboard = new ClipboardJS('.svg_copy', {
        text: function (trigger) {
            return trigger.parentElement.previousElementSibling.innerHTML;
        }
    });

    clipboard.on('success', function (event) {
        alert('SVG copied to clipboard!');
        event.clearSelection();
    });

    clipboard.on('error', function (event) {
        console.error('Failed to copy SVG:', event.error);
    });
});
