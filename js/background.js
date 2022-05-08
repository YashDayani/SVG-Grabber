let blackBackground = [
  "font-size: 40px",
  "font-weight: bold",
  "background-color: #E7E8D1",
  "color: #A7BEAE",
].join(" ;");

let whiteBackground = [
  "font-size: 40px",
  "font-weight: bold",
  "color: #E7E8D1",
  "background-color: #A7BEAE",
].join(" ;");

let linkBackground = [
  "font-size: 25px",
  "font-weight: bold",
  "color: #B85042"
].join(" ;");

console.log(
  "%c Follow Me on Github: %c Yash Dayani \n%c --> https://github.com/yashdayani",
  whiteBackground,
  blackBackground,
  linkBackground
);

let fetchedSVGs = [];


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeSVGs') {
    fetchedSVGs = message.svgArray;
    sendResponse({ status: 'success' });
  } else if (message.action === 'getSVGs') {
    sendResponse({ svgArray: fetchedSVGs });
  }
  console.log(fetchedSVGs);
});