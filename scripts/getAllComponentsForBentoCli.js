const fs = require('node:fs').promises;
const path = require('node:path');


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
  const showcaseMatches = content.matchAll(/<Showcase[^>]+fileName=\{([^}]+)\}[^>]*title="([^"]+)"[^>]*>/g);
  const showcases = [...showcaseMatches].map(match => [match[1], match[2]]);

  return showcases;
}

async function parseExportsFromFiles(files, elementsDir, subSection) {
  let componentsArray = [];

  for (const file of files) {
    const filePath = path.join(elementsDir, file);
    let showcases = await parseShowcaseComponents(filePath);

    showcases =showcases.map(([fileName, name]) => {
      return {
        name,
        fileName,
        category: subSection,
        categorySection: file.replace('.tsx', ''),
      }
    })
    componentsArray = [...componentsArray, ...showcases];
  }

  return componentsArray;
}

async function main() {
  const subSections = ["animation", "ecommerce", "elements", "forms", "panels", "shells", "user"];
  let accumulatedComponentsArray = [];

  for (const subSection of subSections) {
    const elementsIndexPath = path.join(__dirname, `../apps/bento/src/sections/${subSection}/index.tsx`);
    const elementsDir = path.dirname(elementsIndexPath);
    const files = await parseIndexFile(elementsIndexPath);
    const componentsArray = await parseExportsFromFiles(files, elementsDir,subSection);
    accumulatedComponentsArray = [...accumulatedComponentsArray, ...componentsArray];
  }

  // console.log(JSON.stringify(accumulatedComponentsArray, null, 2));
  console.log(accumulatedComponentsArray)


}

main().catch(console.error);