const fs = require('fs');

// Fix config/products.json
const jsonPath = 'config/products.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const correctMedia = [
  { type: "image", src: "products/deep cast varmala preservation/deep cast 1.jpg" },
  { type: "image", src: "products/deep cast varmala preservation/deep cast.jpg" },
  { type: "video", src: "products/deep cast varmala preservation/VID-20260705-WA0082.mp4" }
];

let found = false;
data.products.forEach(p => {
  if (p.id === 'deep-cast') {
    p.media = correctMedia;
    found = true;
  }
});

if (found) {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log("Updated config/products.json");
}

// Fix script.js
const scriptPath = 'script.js';
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Replace the deep-cast media array string using regex
const regex = /({id:"deep-cast",.*?media:\[).*?(\]})/;
scriptContent = scriptContent.replace(regex, (match, p1, p2) => {
  const mediaStr = correctMedia.map(m => `{type:"${m.type}",src:"${m.src}"}`).join(',');
  return p1 + mediaStr + p2;
});

fs.writeFileSync(scriptPath, scriptContent);
console.log("Updated script.js");
