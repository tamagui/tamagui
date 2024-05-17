const fs = require('node:fs').promises;
const path = require('node:path');

const elementsIndexPath = path.join(__dirname, '../apps/bento/src/sections/elements/index.tsx');
const elementsDir = path.dirname(elementsIndexPath);

async function parseIndexFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  // Simple regex to match './filename'
  const matches = content.matchAll(/export \* from '\.\/(.+)'/g);
  const files = [...matches].map(match => `${match[1]}.tsx`);
  return files;
}

async function parseShowcaseComponents(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  // Match <Showcase ... title="..." ... >
  const showcaseMatches = content.matchAll(/<Showcase[^>]+title="([^"]+)"[^>]*>/g);
  const showcases = [...showcaseMatches].map(match => match[1]);

  return showcases;
}

async function parseExportsFromFiles(files) {
  const componentsArray = [];

  for (const file of files) {
    const filePath = path.join(elementsDir, file);
    const showcases = await parseShowcaseComponents(filePath);

    componentsArray.push({
      category: 'elements',
      categorySection: file.replace('.tsx', ''),
      showcases
    });
  }

  return componentsArray;
}

async function main() {
  const files = await parseIndexFile(elementsIndexPath);
  const componentsArray = await parseExportsFromFiles(files);
  console.log(JSON.stringify(componentsArray, null, 2));
}

main().catch(console.error);