#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs-extra')
const esbuild = require('esbuild')
const fg = require('fast-glob')
const createExternalPlugin = require('./externalNodePlugin')
const path = require('path')

const skipJS = process.env.SKIP_JS || false
const shouldSkipTypes = process.argv.includes('skip-types') || process.env.SKIP_TYPES
const shouldWatch = process.argv.includes('--watch')

const pkg = fs.readJSONSync('./package.json')
const pkgSource = pkg.source || 'src/index.ts'
const pkgMain = pkg.main
const pkgModule = pkg.module

async function build() {
  console.log('🥚', pkg.name)
  const x = Date.now()
  let files = (await fg(['src/**/*.ts', 'src/**/*.tsx'])).filter((x) => !x.includes('.d.ts'))

  if (process.env.NO_CLEAN) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
  }

  async function buildTsc() {
    if (process.env.JS_ONLY || shouldSkipTypes) return
    // NOTE:
    // for Intellisense to work in monorepo you need baseUrl: "../.."
    // but to build things nicely we need here to reset a few things:
    //  baseUrl: ., outDir: types, rootDir: src
    // now we can have the best of both worlds
    await fs.remove('types')
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
  }

  const externalPlugin = createExternalPlugin({
    skipNodeModulesBundle: true,
  })

  try {
    await Promise.all([
      buildTsc(),
      ...(skipJS
        ? []
        : [
            pkgMain
              ? esbuild
                  .build({
                    entryPoints: files,
                    outdir: 'dist/cjs',
                    bundle: false,
                    sourcemap: true,
                    target: 'node16',
                    keepNames: true,
                    format: 'cjs',
                    color: true,
                    logLevel: 'error',
                    plugins: [externalPlugin],
                    minify: false,
                    platform: 'neutral',
                  })
                  .then(() => {
                    console.log(' >-> commonjs')
                  })
              : null,
            // dont bundle for tree shaking
            pkgModule
              ? esbuild
                  .build({
                    entryPoints: files,
                    outdir: 'dist/esm',
                    sourcemap: true,
                    target: 'es2020',
                    keepNames: true,
                    format: 'esm',
                    color: true,
                    logLevel: 'error',
                    minify: false,
                    platform: 'neutral',
                  })
                  .then(() => {
                    console.log(' >-> esm')
                  })
              : null,
            esbuild
              .build({
                // only diff is jsx preserve and outdir
                jsx: 'preserve',
                outdir: 'dist/jsx',
                entryPoints: files,
                sourcemap: false,
                target: 'es2020',
                keepNames: true,
                format: 'esm',
                color: true,
                logLevel: 'error',
                minify: false,
                platform: 'neutral',
              })
              .then(() => {
                console.log(' >-> jsx')
              }),
          ]),
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

  // TODO determine internal packages smarter
  const deps = [
    ...new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]),
  ]
    .filter(Boolean)
    .filter((x) => x.includes(`tamagui`))

  const watchDirs = [
    'src',
    ...deps.flatMap((d) => {
      try {
        return path.dirname(require.resolve(d))
      } catch {
        const potentialDir = path.join('..', d.replace('@tamagui/', '') + '/dist')
        if (fs.existsSync(potentialDir)) {
          return potentialDir
        }
        return []
      }
    }),
  ]

  for (const dir of watchDirs) {
    if (dir === 'src') {
      build().then(() => doWatch())
    } else {
      doWatch()
    }

    const watchSize = {}
    function doWatch() {
      const finish = (event, path, stats) => {
        if (dir === 'src' || (stats && stats.size != watchSize[path])) {
          if (stats) watchSize[path] = stats.size
          console.log('watch build', dir)
          build()
        }
      }

      const chokidar = require('chokidar')
      chokidar
        // prevent infinite loop but cause race condition if you just build directly
        .watch(dir, {
          persistent: true,
          alwaysStat: true,
          ignoreInitial: true,
        })
        .on('change', finish)
        .on('add', finish)
    }
  }

  if (deps.length) {
    console.log('  ', pkg.name, '👀', deps.join(', '))
  }
} else {
  process.on('uncaughtException', console.log.bind(console))
  process.on('unhandledRejection', console.log.bind(console))
  build()
}

function debounce(callback, wait) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => callback(...args), wait)
  }
}
