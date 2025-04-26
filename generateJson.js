// generateJson.js (Updated with product code structure)

const fs = require('fs');
const path = require('path');

const pensDir = path.join(__dirname, 'pens');
const trinketsDir = path.join(__dirname, 'trinkets');
const trinketSetsDir = path.join(__dirname, 'trinket_sets');
const configDir = path.join(__dirname, 'config');

function getPngFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.toLowerCase().endsWith('.png'));
}

function toTitleCase(str) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function generatePens() {
  const pens = getPngFiles(pensDir).map(filename => {
    const code = filename.replace('.png', '');
    return {
      code,
      name: toTitleCase(code),
      image: `pens/${filename}`
    };
  });

  fs.writeFileSync(path.join(configDir, 'pens.json'), JSON.stringify(pens, null, 2));
  console.log('Generated pens.json');
}

function generateTrinkets() {
  const trinkets = [];

  if (fs.existsSync(trinketsDir)) {
    const categories = fs.readdirSync(trinketsDir);
    categories.forEach(category => {
      const categoryPath = path.join(trinketsDir, category);
      if (fs.lstatSync(categoryPath).isDirectory()) {
        const files = getPngFiles(categoryPath);
        files.forEach(filename => {
          const code = filename.replace('.png', '');
          trinkets.push({
            code,
            name: toTitleCase(code),
            category,
            image: `trinkets/${category}/${filename}`
          });
        });
      }
    });
  }

  fs.writeFileSync(path.join(configDir, 'trinkets.json'), JSON.stringify(trinkets, null, 2));
  console.log('Generated trinkets.json');
}

function generateTrinketSets() {
  const sets = getPngFiles(trinketSetsDir).map(filename => {
    const code = filename.replace('.png', '');
    return {
      code,
      name: toTitleCase(code),
      image: `trinket_sets/${filename}`
    };
  });

  fs.writeFileSync(path.join(configDir, 'trinket_sets.json'), JSON.stringify(sets, null, 2));
  console.log('Generated trinket_sets.json');
}

function main() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  generatePens();
  generateTrinkets();
  generateTrinketSets();

  console.log('✅ All config JSONs have been updated!');
}

main();
