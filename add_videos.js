const fs = require('fs');

const correctMedia = [
  { type: "image", src: "products/deep cast varmala preservation/deep cast 1.jpg" },
  { type: "image", src: "products/deep cast varmala preservation/deep cast.jpg" },
  { type: "video", src: "products/deep cast varmala preservation/VID-20260705-WA0063.mp4" },
  { type: "video", src: "products/deep cast varmala preservation/VID-20260705-WA0080.mp4" },
  { type: "video", src: "products/deep cast varmala preservation/VID-20260705-WA0081.mp4" },
  { type: "video", src: "products/deep cast varmala preservation/VID-20260705-WA0082.mp4" }
];

// Fix config/products.json
const jsonPath = 'config/products.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
data.products.forEach(p => {
  if (p.id === 'deep-cast') p.media = correctMedia;
});
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

// Fix script.js
const scriptPath = 'script.js';
let scriptContent = fs.readFileSync(scriptPath, 'utf8');
const regex = /({id:"deep-cast",.*?media:\[).*?(\]})/;
scriptContent = scriptContent.replace(regex, (match, p1, p2) => {
  const mediaStr = correctMedia.map(m => `{type:"${m.type}",src:"${m.src}"}`).join(',');
  return p1 + mediaStr + p2;
});
fs.writeFileSync(scriptPath, scriptContent);
console.log("Done adding all videos back to deep cast.");
