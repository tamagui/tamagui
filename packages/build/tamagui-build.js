#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs-extra')
const json5 = require('json5')
const esbuild = require('esbuild')
const fg = require('fast-glob')
const createExternalPlugin = require('./externalNodePlugin')
const debounce = require('lodash.debounce')

const jsOnly = !!process.env.JS_ONLY
const skipJS = !!(process.env.SKIP_JS || false)
const shouldSkipTypes = !!(process.argv.includes('skip-types') || process.env.SKIP_TYPES)
const shouldClean = !!process.argv.includes('clean')
const shouldCleanBuildOnly = !!process.argv.includes('clean:build')
const shouldWatch = process.argv.includes('--watch')

const pkg = fs.readJSONSync('./package.json')

if (shouldClean || shouldCleanBuildOnly) {
  ;(async () => {
    try {
      await Promise.allSettled([fs.remove('.turbo'), fs.remove('types'), fs.remove('dist')])
    } catch {}
    if (shouldCleanBuildOnly) {
      console.log('» cleaned', pkg.name)
      process.exit(0)
    }
    try {
      await Promise.allSettled([fs.remove('node_modules')])
    } catch {}
    console.log('» cleaned', pkg.name)
    process.exit(0)
  })()
} else {
  let shouldSkipInitialTypes = !!process.env.SKIP_TYPES_INITIAL

  const pkgMain = pkg.main
  const pkgModule = pkg.module

  async function build() {
    console.log('»', pkg.name)
    const x = Date.now()
    let files = (await fg(['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.css'])).filter(
      (x) => !x.includes('.d.ts')
    )

    if (process.env.NO_CLEAN) {
      console.log('skip typecheck')
    } else {
      fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
    }

    async function buildTsc() {
      if (jsOnly || shouldSkipTypes) return
      if (shouldSkipInitialTypes) {
        shouldSkipInitialTypes = false
        return
      }

      // NOTE:
      // for Intellisense to work in monorepo you need baseUrl: "../.."
      // but to build things nicely we need here to reset a few things:
      //  baseUrl: ., outDir: types, rootDir: src
      // now we can have the best of both worlds

      // NOTE: to get intellisense to *not* suggest importing from the index file when it re-exports another package...
      // (like tamagui does with @tamagui/core...)
      // we add `exclude: ['src/index.ts']` to the tsconfig.json which fixes that
      // but then it causes it to not export the types out from index... so....
      // we do a stupid, stupid thing to re-write it temporarily without it before build. then restore it after
      // honestly hate typescript config all around but this seems to work so fuck it
      const tsConfOg = await fs.readFile('tsconfig.json')
      const tsConfJSON = json5.parse(tsConfOg)
      if (tsConfJSON.exclude && tsConfJSON.exclude.includes('src/index.ts')) {
        tsConfJSON.exclude = tsConfJSON.exclude.filter((x) => x !== 'src/index.ts')
        await fs.writeJSON('tsconfig.json', tsConfJSON)
      }
      try {
        await exec('npx', [
          'tsc',
          '--baseUrl',
          '.',
          '--outDir',
          'types',
          '--rootDir',
          'src',
          '--declaration',
          '--emitDeclarationOnly',
          '--declarationMap',
        ])
      } finally {
        // restore
        await fs.writeFile('tsconfig.json', tsConfOg)
      }
    }

    async function buildJs() {
      if (skipJS) {
        return
      }
      const start = Date.now()
      return await Promise.all([
        pkgMain
          ? esbuild.build({
              entryPoints: files,
              outdir: 'dist/cjs',
              bundle: false,
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
        // dont bundle for tree shaking
        pkgModule
          ? esbuild.build({
              entryPoints: files,
              outdir: 'dist/esm',
              sourcemap: true,
              target: 'es2019',
              keepNames: false,
              format: 'esm',
              color: true,
              logLevel: 'error',
              minify: false,
              platform: 'neutral',
            })
          : null,
        esbuild.build({
          // only diff is jsx preserve and outdir
          jsx: 'preserve',
          outdir: 'dist/jsx',
          entryPoints: files,
          sourcemap: false,
          target: 'es2019',
          keepNames: false,
          format: 'esm',
          color: true,
          logLevel: 'error',
          minify: false,
          platform: 'neutral',
        }),
      ]).then(() => {
        console.log(`built js in ${Date.now() - start}ms`)
      })
    }

    const externalPlugin = createExternalPlugin({
      skipNodeModulesBundle: true,
    })

    try {
      await Promise.all([
        //
        buildTsc(),
        buildJs(),
      ])
    } catch (error) {
      console.log('error', error)
    } finally {
      console.log('built in', `${(Date.now() - x) / 1000}s`)
    }
  }

  if (shouldWatch) {
    const path = require('path')
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
  } else {
    build()
  }
}
