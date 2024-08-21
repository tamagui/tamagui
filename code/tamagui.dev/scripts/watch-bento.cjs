const fs = require('node:fs')
const path = require('node:path')
const chokidar = require('chokidar')
const { exec } = require('child_process')
const { rm } = require('fs/promises')

const rootDirectory = path.resolve(process.cwd(), '../bento/src/components')
const outputDir = path.resolve(process.cwd(), './bento-output')

let isBuilding = false

async function buildBento() {
  if (isBuilding) {
    console.log('Build already in progress, skipping...')
    return
  }

  isBuilding = true
  console.log('Building Bento...')
  return new Promise((resolve, reject) => {
    exec('node ./scripts/build-bento.cjs', (error, stdout, stderr) => {
      isBuilding = false
      if (error) {
        console.error(`Error executing build script: ${error.message}`)
        reject(error)
        return
      }
      if (stderr) {
        console.error(`Build script stderr: ${stderr}`)
      }
      console.log(`Build completed successfully`)
      resolve()
    })
  })
}

async function cleanOutputDirectory() {
  try {
    await rm(outputDir, { recursive: true, force: true })
    await fs.promises.mkdir(outputDir, { recursive: true })
    console.log(`Cleaned output directory: ${outputDir}`)
  } catch (err) {
    console.error(`Error cleaning output directory: ${err.message}`)
  }
}

const watcher = chokidar.watch(rootDirectory, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
})

let changeTimeout = null

async function handleChange(path) {
  console.log(`Change detected in ${path}`)
  clearTimeout(changeTimeout)
  changeTimeout = setTimeout(async () => {
    await cleanOutputDirectory()
    await buildBento()
  }, 1000) // Debounce for 1 second
}

watcher
  .on('add', handleChange)
  .on('change', handleChange)
  .on('unlink', handleChange)

console.log(`Watching for changes in ${rootDirectory}`)
buildBento() // Initial build
