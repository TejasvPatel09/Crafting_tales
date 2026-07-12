const fs = require('fs');

const path = 'script.js';
let content = fs.readFileSync(path, 'utf8');

const replacementPath = 'script_products_replacement.txt';
const replacement = fs.readFileSync(replacementPath, 'utf8');

const regex = /products:\s*\[[\s\S]*?\](?=\n\s*};\n\s*\/\* ===)/;
if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content);
  console.log("Successfully updated script.js");
} else {
  console.log("Could not find the products array in script.js using regex.");
}
