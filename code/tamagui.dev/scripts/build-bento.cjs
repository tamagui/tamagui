const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('acorn')
const walk = require('acorn-walk')
const glob = require('glob')
const { ensureFileSync, ensureDirSync, rmdirSync, rmSync } = require('fs-extra')
const archiver = require('archiver')
const skipImports = ['../../general/_Showcase']

function analyzeIndexFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  try {
    const ast = parse(fileContent, { sourceType: 'module' })

    const exportedModules = []

    walk.simple(ast, {
      ExportAllDeclaration(node) {
        const exportedName = node.source.value
        exportedModules.push(exportedName)
      },
    })

    return exportedModules
  } catch (err) {
    console.error(`Error parsing file: ${filePath}`)
    throw new Error(err)
  }
}

function shake(content) {
  return content
    .replaceAll(/\$group-window-(\w+)/g, (match, group) => `$${group}`)
    .replaceAll(/([a-zA-Z0-9_]+\.fileName\s*=\s*)'([^']*)'/g, '')
    .replace('Portal: ({ children }) => children', 'Portal: DrawerPortal')
}

async function copyMergedComponents(directoryPath, outputDirectory) {
  const indexFiles = ['index.js', 'index.tsx', 'index.ts']

  const indexPaths = indexFiles.map((indexFile) => path.join(directoryPath, indexFile))
  const foundIndex = indexPaths.find(fs.existsSync)

  if (foundIndex && !foundIndex.includes('components/index')) {
    const exportedModules = analyzeIndexFile(foundIndex)

    console.info('exporting from', foundIndex, 'modules', exportedModules)

    exportedModules.forEach((exportedModule) => {
      const modulePath = path.join(directoryPath, exportedModule)
      const outputFilePath = path.join(
        outputDirectory,
        directoryPath.replace(rootDirectory, ''),
        exportedModule
      )
      fs.mkdirSync(path.dirname(outputFilePath), { recursive: true })
      const outputContent = shake(processFile(`${modulePath}.tsx`))
      fs.writeFileSync(`${outputFilePath}.tsx`, outputContent)
    })
  } else {
    const files = fs.readdirSync(directoryPath)

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        copyMergedComponents(filePath, outputDirectory)
      }
    })
  }
}

function copyUnmergedComponents(directoryPath, outputDirectory) {
  return new Promise((resolve) => {
    glob(`${directoryPath}/**/*`, { nodir: true }, (error, matches) => {
      for (const match of matches) {
        let fileContent = fs.readFileSync(match, 'utf8')
        fileContent = replaceInternals(fileContent)

        const outputFilePath = match.replace(rootDirectory, outputDirectory)
        ensureFileSync(outputFilePath)
        fs.writeFileSync(outputFilePath, fileContent)
      }

      resolve()
    })
  })
}

const matchImportsRegex = /from\s+['"](\.[^'"]+)['"]/gi

function processFile(filePath, visitedFiles = new Set(), indent = 0) {
  if (visitedFiles.has(filePath)) {
    return ''
  }

  visitedFiles.add(filePath)

  if (!indent) {
    console.info('ANALYZE', filePath)
  }

  let fileContent = fs.readFileSync(filePath, 'utf8')
  fileContent = replaceInternals(fileContent)

  const importStatements = []
  for (const match of fileContent.matchAll(matchImportsRegex)) {
    importStatements.push(match[0])
  }

  console.info(indent ? '  ' : '', 'importStatements', importStatements)

  let appendedContent = fileContent
  appendedContent = `/** START of the file ${filePath
    .split('/')
    .pop()} */\n${appendedContent}`

  for (const importStatement of importStatements) {
    const importPathMatch = importStatement.match(/from ['"](.*?)['"]/)

    if (skipImports.includes(importPathMatch[1])) {
      continue
    }

    if (importPathMatch) {
      const importPath = importPathMatch[1]

      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const possibleFileExtensions = ['.native.tsx', '.tsx', '.ts']
        let foundImport = false
        for (const extension of possibleFileExtensions) {
          const alternativePath = path.resolve(
            path.dirname(filePath),
            `${importPath}${extension}`
          )
          if (fs.existsSync(alternativePath)) {
            appendedContent += processFile(alternativePath, visitedFiles, indent + 1)
            foundImport = true
          }
        }

        if (!foundImport) {
          console.error(
            `Warning: File not found for import statement: ${importStatement}`
          )
        }
      }
    }
  }

  if (!indent) {
    console.info('DUN')
  }

  return appendedContent
}

function replaceInternals(fileContent) {
  // here we change custom hooks to hooks to be used in consumer applications
  // change useGroupMedia to useMedia
  fileContent = fileContent.replace(
    /import {.*useGroupMedia.*} from.*/g,
    `import { useMedia } from 'tamagui'`
  )
  fileContent = fileContent.replace(/useGroupMedia\(.*\)/g, `useMedia()`)
  // change useContainerDim to useWindowDimensions
  fileContent = fileContent.replace(
    /import {.*useContainerDim.*} from.*/g,
    `import { useWindowDimensions } from 'tamagui'`
  )
  fileContent = fileContent.replace(/useContainerDim\(.*\)/g, `useWindowDimensions()`)
  return fileContent
}

function zipDirectory(sourceDir, outputDir) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputDir)
    const archive = archiver('zip', {
      // zlib: { level: 9 },
    })
    archive.pipe(output)
    archive.directory(sourceDir, false)
    output.on('close', () => {
      console.info(
        `archived ${outputDir
          .split('/')
          .pop()} finalized with ${archive.pointer()} total bytes`
      )
      resolve()
    })
    archive.on('error', (error) => {
      console.error('error while archiving: ', error)
      reject(error)
    })
    archive.on('warning', (warning) => console.warn('warning while archiving: ', warning))
    archive.finalize()
  })
}

const rootDirectory = path.resolve(process.cwd(), '../bento/src/components')
const mergedOutputDir = path.resolve(process.cwd(), './bento-output/merged')
const unmergedOutputDir = path.resolve(process.cwd(), './bento-output/unmerged')
const zipBundleOutputPath = path.resolve(process.cwd(), 'bento-output/bento-bundle.zip')

rmSync(path.resolve(process.cwd(), './bento-output'), { force: true, recursive: true })
ensureDirSync(mergedOutputDir)
ensureDirSync(unmergedOutputDir)

async function main() {
  await copyMergedComponents(rootDirectory, mergedOutputDir)
  await copyUnmergedComponents(rootDirectory, unmergedOutputDir)
  await zipDirectory(unmergedOutputDir, zipBundleOutputPath)
}

main()
