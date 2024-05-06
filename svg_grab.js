// Select all SVG elements on the page

const svgElements = document.querySelectorAll('svg');

// Log the number of SVG elements found
console.log('Number of SVG elements:', svgElements.length);
document.getElementById("totalSVG").textContent=svgElements.length
// Loop through each SVG element and log its contents
svgElements.forEach(svgElement => {
    console.log('SVG element:', svgElement);
});



// async function grabSvg() {
//     let [tab] = await chrome.tab.query({active:true});
//     chrome.scripting.executeScript({
//         target:{tabID: tab.id},
//         func:()=>{
//             alert("Hello")
//         }
//     });
// }

// document.getElementById("myButton").addEventListener("click",addSVGToHTML);