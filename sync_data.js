const fs = require('fs');

const scriptPath = 'script.js';
const jsonPath = 'config/products.json';

const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Use a regex or Function to extract the products array from script.js
// It's inside FALLBACK_DATA
const match = scriptContent.match(/products:\s*(\[\s*\{[\s\S]*?\}\s*\])\s*\n\s*\};/);

if (match && match[1]) {
  try {
    // Evaluate it as JS since it has unquoted keys
    const productsArray = eval('(' + match[1] + ')');
    
    // Read the JSON file
    let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Replace products
    jsonData.products = productsArray;
    
    // Write back to JSON
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    console.log("Successfully synced config/products.json with script.js FALLBACK_DATA.");
  } catch (e) {
    console.error("Error evaluating or writing data:", e);
  }
} else {
  console.log("Could not extract products array from script.js");
}
