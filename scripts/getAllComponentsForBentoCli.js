const fs = require('node:fs').promises
const path = require('node:path')

async function parseIndexFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8')
  const matches = content.matchAll(/export \* from '\.\/(.+)'/g)
  const files = [...matches].map((match) => `${match[1]}.tsx`)
  return files
}

async function parseShowcaseComponents(filePath) {
  const content = await fs.readFile(filePath, 'utf8')
  const showcaseMatches = content.matchAll(
    /<Showcase[^>]+fileName=\{([^}]+)\}[^>]*title="([^"]+)"[^>]*>/g
  )
  const showcases = [...showcaseMatches].map((match) => [match[1], match[2]])

  return showcases
}

async function parseComponentFilename(filePath) {
  const content = await fs.readFile(filePath, 'utf8')
  const fileNameMatch = content.match(/fileName = '([^']+)'[^}]*/)
  const fileName = fileNameMatch[0].split("'")[1]

  return fileName
}

async function parseExportsFromFiles(files, elementsDir, subSection) {
  let componentsArray = []

  for (const file of files) {
    const filePath = path.join(elementsDir, file)
    let showcases = await parseShowcaseComponents(filePath)

    showcases = showcases.map(([fileName, name]) => {
      return {
        name,
        fileNamePath: fileName,
        fileName,
        category: subSection,
        categorySection: file.replace('.tsx', ''),
      }
    })
    componentsArray = [...componentsArray, ...showcases]
  }

  return componentsArray
}

async function main() {
  const subSections = [
    'animation',
    'ecommerce',
    'elements',
    'forms',
    'panels',
    'shells',
    'user',
  ]
  let accumulatedComponentsArray = []

  for (const subSection of subSections) {
    const elementsIndexPath = path.join(
      __dirname,
      `../code/bento/src/sections/${subSection}/index.tsx`
    )
    const elementsDir = path.dirname(elementsIndexPath)
    const files = await parseIndexFile(elementsIndexPath)
    const componentsArray = await parseExportsFromFiles(files, elementsDir, subSection)
    accumulatedComponentsArray = [...accumulatedComponentsArray, ...componentsArray]
  }

  const result = await Promise.allSettled(
    accumulatedComponentsArray.map(async (item) => {
      const componentPath = path.join(
        __dirname,
        `../code/bento/src/components/${item.category}/${item.categorySection}/${
          item.fileName.split('.')[1]
        }.tsx`
      )
      const filename = await parseComponentFilename(componentPath)
      return { ...item, fileName: filename, componentPath }
    })
  )
  //TODO: missing to handle components that are not fullfilled
  return result.filter((item) => item.status === 'fulfilled').map((item) => item.value)
}

main().catch(console.error)
