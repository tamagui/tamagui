#!/usr/bin/env node
/* eslint-disable no-console */

const exec = require('execa')
const fs = require('fs-extra')
const esbuild = require('esbuild')
const fg = require('fast-glob')
const createExternalPlugin = require('./externalNodePlugin')
const debounce = require('lodash.debounce')
const { dirname } = require('path')

const jsOnly = !!process.env.JS_ONLY
const skipJS = !!(process.env.SKIP_JS || false)
const shouldSkipTypes = !!(process.argv.includes('--skip-types') || process.env.SKIP_TYPES)
const shouldBundle = !!process.argv.includes('--bundle')
const shouldClean = !!process.argv.includes('clean')
const shouldCleanBuildOnly = !!process.argv.includes('clean:build')
const shouldWatch = process.argv.includes('--watch')

const pkg = fs.readJSONSync('./package.json')
let shouldSkipInitialTypes = !!process.env.SKIP_TYPES_INITIAL
const pkgMain = pkg.main
const pkgModule = pkg.module
const pkgModuleJSX = pkg['module:jsx']

const flatOut = [pkgMain, pkgModule, pkgModuleJSX].filter(Boolean).length === 1

async function clean() {
  try {
    await Promise.allSettled([
      //
      fs.remove('.turbo'),
      fs.remove('.ultra.cache.json'),
      fs.remove('types'),
      fs.remove('dist'),
    ])
  } catch {
    // ok
  }
  if (shouldCleanBuildOnly) {
    console.log('🔹 cleaned', pkg.name)
    process.exit(0)
  }
  try {
    await Promise.allSettled([fs.remove('node_modules')])
  } catch {
    // ok
  }
  console.log('🔹 cleaned', pkg.name)
  process.exit(0)
}

if (shouldClean || shouldCleanBuildOnly) {
  clean().then(() => {
    process.exit(0)
  })
  return
}

if (shouldWatch) {
  process.env.IS_WATCHING = true
  process.env.DISABLE_AUTORUN = true
  build().then(() => {
    const rebuild = debounce(build, 100)
    const chokidar = require('chokidar')
    chokidar
      // prevent infinite loop but cause race condition if you just build directly
      .watch('src', {
        persistent: true,
        alwaysStat: true,
        ignoreInitial: true,
      })
      .on('change', rebuild)
      .on('add', rebuild)
  })
  return
}

build()

async function build() {
  if (process.env.DEBUG) console.log('🔹', pkg.name)
  try {
    const start = Date.now()
    await Promise.all([
      //
      buildTsc(),
      buildJs(),
    ])
    console.log('built', pkg.name, 'in', Date.now() - start, 'ms')
  } catch (error) {
    console.error(`Error building:`, error.message)
  }
}

// const targetDir = `.types${Math.floor(Math.random() * 1_000_000)}`
// const cleanup = () => {
//   try {
//     fs.removeSync(targetDir)
//   } catch {
//     // ok
//   }
// }

// process.once('beforeExit', cleanup)
// process.once('SIGINT', cleanup)
// process.once('SIGTERM', cleanup)

async function buildTsc() {
  if (jsOnly || shouldSkipTypes) return
  if (shouldSkipInitialTypes) {
    shouldSkipInitialTypes = false
    return
  }

  async function buildThenCopy() {
    if (!(await fs.pathExists(`tsconfig.json`))) {
      throw new Error(`No tsconfig.json found`)
    }
    const targetDir = 'types'
    try {
      // typescripts build cache messes up when doing declarationOnly
      await fs.remove('tsconfig.tsbuildinfo')
      await fs.ensureDir(targetDir)
      const cmd = `tsc --baseUrl . --outDir ${targetDir} --rootDir src --emitDeclarationOnly --declarationMap`
      // console.log('\x1b[2m$', `npx ${cmd}`)
      await exec('npx', cmd.split(' '))
    } finally {
      await fs.remove('tsconfig.tsbuildinfo')
    }
  }

  // NOTE:
  // for Intellisense to work in monorepo you need baseUrl: "../.."
  // but to build things nicely we need here to reset a few things:
  //  baseUrl: ., outDir: types, rootDir: src
  // for best of both worlds

  // there's a bug with typescript where outputting within the same dir just doesn't output for whatever reason
  // i have a hunch it's some cache thing, because if i give a new outDir it works
  // so fixing by always giving a random tmp outdir, and then copying
  await buildThenCopy()
}

async function buildJs() {
  if (skipJS) {
    return
  }
  let files = (await fg(['src/**/*.(m)?[jt]s(x)?', 'src/**/*.css'])).filter(
    (x) => !x.includes('.d.ts')
  )
  const externalPlugin = createExternalPlugin({
    skipNodeModulesBundle: true,
  })
  const start = Date.now()
  return await Promise.all([
    pkgMain
      ? esbuildWriteIfChanged({
          entryPoints: files,
          outdir: flatOut ? 'dist' : 'dist/cjs',
          bundle: shouldBundle,
          sourcemap: true,
          target: 'node14',
          keepNames: false,
          format: 'cjs',
          color: true,
          logLevel: 'error',
          plugins: [externalPlugin],
          minify: false,
          platform: 'node',
        })
      : null,
    pkgModule
      ? esbuildWriteIfChanged({
          entryPoints: files,
          outdir: flatOut ? 'dist' : 'dist/esm',
          bundle: shouldBundle,
          sourcemap: true,
          target: 'node16',
          keepNames: false,
          format: 'esm',
          color: true,
          logLevel: 'error',
          minify: false,
          platform: shouldBundle ? 'node' : 'neutral',
        })
      : null,
    pkgModuleJSX
      ? esbuildWriteIfChanged({
          // only diff is jsx preserve and outdir
          jsx: 'preserve',
          outdir: flatOut ? 'dist' : 'dist/jsx',
          entryPoints: files,
          bundle: shouldBundle,
          sourcemap: true,
          target: 'es2020',
          keepNames: false,
          format: 'esm',
          color: true,
          logLevel: 'error',
          minify: false,
          platform: 'neutral',
        })
      : null,
  ]).then(() => {
    if (process.env.DEBUG) console.log(`built js in ${Date.now() - start}ms`)
  })
}

/**
 * esbuild but avoids touching unchanged files to not freak out vite
 * @param {esbuild.BuildOptions} opts
 * @returns {Promise<void>}
 */
async function esbuildWriteIfChanged(opts) {
  if (shouldWatch) {
    const built = await esbuild.build({ ...opts, write: false })
    if (!built.outputFiles) {
      return
    }
    await Promise.all(
      built.outputFiles.map(async (file) => {
        const outDir = dirname(file.path)
        await fs.ensureDir(outDir)
        const outString = new TextDecoder().decode(file.contents)
        if (
          !(await fs.pathExists(file.path)) ||
          (await fs.readFile(file.path, 'utf8')) !== outString
        ) {
          // console.log('write', file.path)
          await fs.writeFile(file.path, outString)
        }
      })
    )
  } else {
    await esbuild.build(opts)
  }
}
