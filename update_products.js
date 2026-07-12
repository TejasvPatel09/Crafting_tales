const fs = require('fs');

const path = './config/products.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.products.forEach(p => {
  if (p.id === 'flower-preservation') {
    p.name = "Flower Preservation Wooden Frame";
    p.price = 2100;
    p.specs = [["Size", "10 inch"], ["Material", "Crystal-clear epoxy resin"], ["Inclusions", "Dried florals"], ["Features", "With Stand"]];
  }
  else if (p.id === 'full-varmala') {
    p.price = 5000;
    p.description = "Semi deep preservation with acrylic slidders. The full wedding garland — without breaking a single bloom — preserved intact and cast in crystal-clear resin.";
    p.specs = [["Size", "12x18 inch"], ["Material", "Crystal-clear epoxy resin"], ["Preservation", "Full intact garland"], ["Features", "Acrylic sliders"]];
  }
  else if (p.id === 'varmala-frame') {
    p.price = 1700;
    p.specs = [["Size", "10 inch"], ["Features", "With stand"], ["Frame Material", "Premium teakwood"], ["Finish", "Crystal-clear epoxy resin"]];
  }
  else if (p.id === '3d-block') {
    p.price = 2500;
    p.specs = [["Size", "6.5 inches"], ["Material", "Crystal-clear epoxy resin"], ["Style", "Layered 3D suspension"]];
  }
  else if (p.id === 'deep-cast') {
    p.price = 5000;
    p.specs = [["Size", "9x12 inch"], ["Depth", "35 mm"], ["Frame Material", "Teakwood"], ["Finish", "Crystal-clear epoxy resin"]];
  }
  else if (p.id === 'love-letter') {
    p.price = 1800;
    p.specs = [["Size", "9x12 inch"], ["Material", "Crystal-clear epoxy resin"], ["Inclusions", "Handwritten letter + rose"]];
    p.variants = { type: "Option", options: [ { value: "Without Stand", price: 1800 }, { value: "With Stand", price: 1900 } ] };
  }
  else if (p.id === 'nameplate') {
    p.price = 2000;
    p.specs = [["Size", "14 inch"], ["Material", "Resin on wood base"], ["Personalisation", "Your name / family name"]];
  }
  else if (p.id === 'geode-clock') {
    p.price = 3000;
    p.specs = [["Size", "18x16 inch approx."], ["Material", "Resin on wood base"], ["Mechanism", "Silent sweep quartz"]];
    delete p.variants;
  }
  else if (p.id === 'beach-clock') {
    p.price = 2000;
    p.specs = [["Size", "14 inch (can be customized)"], ["Material", "Resin on wood base"], ["Mechanism", "Silent sweep quartz"]];
    delete p.variants;
  }
  else if (p.id === 'resin-toran') {
    p.price = 3200;
    p.specs = [["Size", "36x7 inch"], ["Base", "MDF"], ["Material", "Crystal-clear epoxy resin"], ["Occasion", "Festive doorway decor"]];
  }
  else if (p.id === 'letter-keychain') {
    p.price = 100;
    p.specs = [["Size", "3 inches approx."], ["Material", "Crystal-clear epoxy resin"], ["Inclusions", "Dried florals + gold leaf"], ["Personalisation", "Any single initial (A-Z)"]];
  }
  else if (p.id === 'photo-keychain') {
    p.price = 200;
    p.specs = [["Size", "3 inches approx."], ["Material", "Crystal-clear epoxy resin"], ["Inclusions", "Your printed photo + gold leaf"], ["Personalisation", "Any single photo"]];
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));

// Generate the script.js replacement code
// Format it nicely just like the original file
let scriptReplacement = "    products: [\n";
data.products.forEach((p, i) => {
  let str = JSON.stringify(p);
  // Unquote keys to match the previous style (optional but looks nice)
  str = str.replace(/"([^"]+)":/g, "$1:");
  scriptReplacement += "      " + str + (i < data.products.length - 1 ? ",\n" : "\n");
});
scriptReplacement += "    ]";

fs.writeFileSync('./script_products_replacement.txt', scriptReplacement);
console.log("Done updating products.json and generated script_products_replacement.txt");
