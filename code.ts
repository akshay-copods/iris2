// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
function assignRandomNumber() {
  // Array of three numbers
  let numbers = [1, 2, 3];

  // Loop three times
  for (let i = 0; i < 3; i++) {
    // Get a random index
    const randomIndex = Math.floor(Math.random() * numbers.length);

    // Assign the number at the random index to a variable
    const assignedNumber = numbers[randomIndex];
    console.log(`Assigned Number: ${assignedNumber}`);

    // Remove the assigned number from the array
    numbers.splice(randomIndex, 1);
  }
}

const usedNumbers = [];
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 380, height: 455 });
async function loadFont() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  const allLayers = figma.currentPage.children;
  const frames = allLayers.filter((layer) => layer.type === "FRAME");
  for (const frame of frames) {
    const newFrame = figma.createFrame();
    newFrame.resize(100, 100);
    // position the frame on top right of the current frame
    newFrame.x = frame.x + frame.width;
    newFrame.y = frame.y;
    // add different numbers to the new frame
    const textNode = figma.createText();
    textNode.characters = assignUniqueNumber().toString();
    textNode.fontSize = 20;
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";
    textNode.x = 20; // X-coordinate
    textNode.y = 30; // Y-coordinate
    textNode.fontName = { family: "Inter", style: "Regular" };
    newFrame.appendChild(textNode);
    figma.currentPage.appendChild(newFrame);
  }

  function assignUniqueNumber() {
    let number;
    do {
      number = assignRandomNumber();
    } while (usedNumbers.includes(number));

    usedNumbers.push(number);
    return number;
  }

  function assignRandomNumber() {
    // Your logic to generate a random number
    return Math.floor(Math.random() * 21) + 70;
  }
}
loadFont();

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
//create a figma frame and add text onto it

async function createTextFrame(y: string) {
  // Create a new frame
  const frame = figma.createFrame();
  // Set the dimensions of the frame
  frame.resize(400, 300);

  // Load the font

  // Create a new text node
  const textNode = figma.createText();
  textNode.characters = y; // Set the text content
  textNode.textAutoResize = "WIDTH_AND_HEIGHT";

  // Position the text node within the frame
  textNode.x = 20; // X-coordinate
  textNode.y = 30; // Y-coordinate

  // Set the font for the text node
  textNode.fontName = { family: "Inter", style: "Regular" };
  if (textNode.width > 400) {
    textNode.resize(400, textNode.height + textNode.fontSize); // You can adjust this value as needed
  }
  // Add the text node as a child of the frame
  frame.appendChild(textNode);

  // Add the frame to the current page
  figma.currentPage.appendChild(frame);
}
async function printData(word) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  createTextFrame(word);
}
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.

  if (msg.type === "create-rectangles") {
    printData(msg.generatedText);
  }

  if (msg.type === "compare-slides") {
    figma.ui.resize(935, 741);
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
