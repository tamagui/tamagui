const fs = require('node:fs').promises;
const path = require('node:path');
const ts = require('typescript');

const elementsDir = path.join(__dirname, '../apps/bento/src/sections/elements');

async function readAndParseFiles(dir) {
  const files = await fs.readdir(dir);
  const componentsArray = [];

  for (const file of files) {
    if (file.endsWith('.tsx') && !file.startsWith('index')) {
      const filePath = path.join(dir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const exports = parseExports(content);
      const categorySection = file.replace('.tsx', '');

      componentsArray.push({
        category: 'elements',
        categorySection,
        exports
      });
    }
  }

  return componentsArray;
}

function parseExports(fileContent) {
  // This is a very basic and naive implementation.
  // You might want to use a proper AST parser for TypeScript files.
  const exportRegex = /export (const|function) (\w+)/g;
  let match;
  const exports = [];

  while ((match = exportRegex.exec(fileContent)) !== null) {
    exports.push(match[2]);
  }

  return exports;
}

async function main() {
  const componentsArray = await readAndParseFiles(elementsDir);
  console.log(JSON.stringify(componentsArray, null, 2));
}

main().catch(console.error);