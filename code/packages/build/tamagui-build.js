#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * tamagui-build - build tool for tamagui packages
 *
 * usage:
 *   tamagui-build                     # build js + types
 *   tamagui-build --watch             # watch mode
 *   tamagui-build --skip-types        # js only
 *   tamagui-build --skip-native       # skip native builds
 *   tamagui-build --skip-sourcemaps   # disable js + d.ts sourcemaps
 *   tamagui-build clean               # remove dist/types/node_modules
 *   tamagui-build clean:build         # remove dist/types only
 *
 *   --swap-exports                    # for publishing: swaps exports.types
 *                                     # from ./src/*.ts to ./types/*.d.ts
 *                                     # if command given after --, runs it
 *                                     # then swaps back. exit code preserved.
 *
 *   examples:
 *     tamagui-build --swap-exports -- npm publish
 *     tamagui-build --swap-exports -- pnpm publish --no-git-checks
 */

const FSE = require('fs-extra')
const esbuild = require('esbuild')
const fastGlob = require('fast-glob')
const picomatch = require('picomatch')
const { rolldown } = require('rolldown')
const createExternalPlugin = require('./externalNodePlugin')
const debounce = require('lodash.debounce')
const { basename, dirname } = require('node:path')
const { es5Plugin } = require('./esbuild-es5')
const { transformSync: oxcTransformSync } = require('oxc-transform')
const { getTsconfig } = require('get-tsconfig')
const path = require('node:path')
const childProcess = require('node:child_process')
const { getTypeScriptNativePath } = require('./typescript-native')
const {
  printEsbuildError,
  printBuildError,
  printTypescriptCompilationError,
  printOxcErrors,
} = require('./pretty-print-errors')

const jsOnly = !!process.env.JS_ONLY
const skipJS = !!(process.env.SKIP_JS || false)

// write file only if contents changed to avoid triggering watchers
async function writeIfUnchanged(filePath, contents) {
  const isExecutableScript = typeof contents === 'string' && contents.startsWith('#!')
  const existing = await FSE.readFile(filePath, 'utf8').catch(() => null)
  if (existing === contents) {
    if (isExecutableScript) {
      await FSE.chmod(filePath, 0o755).catch(() => {})
    }
    return false
  }
  await FSE.outputFile(filePath, contents, {
    encoding: 'utf8',
    mode: isExecutableScript ? 0o755 : 0o666,
  })
  if (isExecutableScript) {
    await FSE.chmod(filePath, 0o755).catch(() => {})
  }
  return true
}

function dceTamaguiTarget(contents, { format, jsx, platform }) {
  if (!contents.includes('process.env.TAMAGUI_TARGET')) {
    return contents
  }

  const result = oxcTransformSync(
    `tamagui-target.${jsx === 'preserve' ? 'jsx' : 'js'}`,
    contents,
    {
      lang: jsx === 'preserve' ? 'jsx' : 'js',
      jsx: jsx === 'preserve' ? 'preserve' : undefined,
      sourceType: format === 'cjs' ? 'commonjs' : 'module',
      define: {
        'process.env.TAMAGUI_TARGET': JSON.stringify(platform),
      },
    }
  )

  if (result.errors?.length) {
    throw new Error(
      `Failed to DCE TAMAGUI_TARGET for ${platform}: ${result.errors
        .map((error) => error.message)
        .join('\n')}`
    )
  }

  return result.code || contents
}

const sideEffectsMatchersCache = new Map()
const packageSideEffectsCache = new Map()
const sideEffectsExtensionCandidates = ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx']

function normalizeSideEffectsSpecifier(specifier) {
  return specifier
    .replace(/[?#].*$/, '')
    .replace(/^\.\/+/, '')
    .replace(/^\/+/, '')
}

function getSideEffectsSpecifierCandidates(specifier) {
  const normalized = normalizeSideEffectsSpecifier(specifier)
  if (!normalized) return []

  const candidates = [normalized]
  const lastSegment = normalized.split('/').pop() || ''
  const hasKnownExtension = /\.(?:[cm]?js|jsx|tsx?|css|json)$/.test(lastSegment)

  if (!hasKnownExtension) {
    for (const extension of sideEffectsExtensionCandidates) {
      candidates.push(`${normalized}${extension}`)
    }
    for (const extension of sideEffectsExtensionCandidates) {
      candidates.push(`${normalized}/index${extension}`)
    }
  }

  return candidates
}

function sideEffectsMatch(sideEffects, specifier) {
  if (sideEffects === true || sideEffects === undefined) return true
  if (sideEffects === false) return false
  if (!Array.isArray(sideEffects)) return true

  const candidates = getSideEffectsSpecifierCandidates(specifier)
  if (!candidates.length) return false

  const cacheKey = JSON.stringify(sideEffects)
  let matcher = sideEffectsMatchersCache.get(cacheKey)
  if (!matcher) {
    matcher = picomatch(sideEffects, { dot: true })
    sideEffectsMatchersCache.set(cacheKey, matcher)
  }
  return candidates.some((candidate) => matcher(candidate))
}

function getPackageNameFromSpecifier(specifier) {
  if (!specifier || specifier.startsWith('.') || specifier.startsWith('/')) return null
  if (specifier.startsWith('node:')) return null
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

function findPackageJsonFromResolvedFile(filePath, packageName) {
  let current = dirname(filePath)
  while (current && current !== dirname(current)) {
    const packageJsonPath = path.join(current, 'package.json')
    if (FSE.existsSync(packageJsonPath)) {
      try {
        const json = FSE.readJSONSync(packageJsonPath)
        if (!packageName || json.name === packageName) {
          return { path: packageJsonPath, json }
        }
      } catch {
        return null
      }
    }
    current = dirname(current)
  }
  return null
}

function getPackageSideEffects(packageName) {
  if (packageSideEffectsCache.has(packageName)) {
    return packageSideEffectsCache.get(packageName)
  }

  let found = null

  try {
    const packageJsonPath = require.resolve(`${packageName}/package.json`, {
      paths: [process.cwd()],
    })
    found = {
      path: packageJsonPath,
      json: FSE.readJSONSync(packageJsonPath),
    }
  } catch {
    try {
      const resolved = require.resolve(packageName, {
        paths: [process.cwd()],
      })
      found = findPackageJsonFromResolvedFile(resolved, packageName)
    } catch {
      found = null
    }
  }

  const value = found
    ? {
        sideEffects: found.json.sideEffects,
      }
    : null

  packageSideEffectsCache.set(packageName, value)
  return value
}

function moduleHasSideEffects(id) {
  if (id.startsWith('.') || id.startsWith('/')) {
    return sideEffectsMatch(pkg.sideEffects, id)
  }

  const packageName = getPackageNameFromSpecifier(id)
  if (!packageName) return true

  const packageInfo = getPackageSideEffects(packageName)
  if (!packageInfo) return true

  const subpath = normalizeSideEffectsSpecifier(id.slice(packageName.length))
  return sideEffectsMatch(packageInfo.sideEffects, subpath)
}

function stripRolldownRegionComments(contents) {
  return contents
    .replace(/^\/\/#region[^\n]*(?:\n|$)/gm, '')
    .replace(/^\/\/#endregion[^\n]*(?:\n|$)/gm, '')
}

async function pruneUnusedImports(contents, filePath) {
  if (!contents.includes('import')) {
    return contents
  }

  const entryId = `${path.resolve(filePath)}?tamagui-build-prune`

  const bundle = await rolldown({
    input: entryId,
    external: (id) => id !== entryId,
    platform: 'neutral',
    plugins: [
      {
        name: 'tamagui-build-prune-entry',
        resolveId(id) {
          if (id === entryId) return id
        },
        load(id) {
          if (id === entryId) {
            return {
              code: contents,
              moduleSideEffects: true,
            }
          }
        },
      },
    ],
    treeshake: {
      moduleSideEffects: (id) => moduleHasSideEffects(id),
    },
  })

  try {
    const result = await bundle.generate({
      format: 'esm',
      sourcemap: false,
      comments: false,
      minify: false,
    })
    const chunk = result.output.find((item) => item.type === 'chunk')
    return chunk?.code ? stripRolldownRegionComments(chunk.code) : contents
  } finally {
    await bundle.close?.()
  }
}

function resolveOutputModuleSpecifier(
  specifier,
  filePath,
  outputExtension,
  outputPaths = new Set()
) {
  if (!specifier.startsWith('.') && !specifier.startsWith('/')) {
    return specifier
  }

  const suffixIndex = specifier.search(/[?#]/)
  const suffix = suffixIndex === -1 ? '' : specifier.slice(suffixIndex)
  const pathname = suffixIndex === -1 ? specifier : specifier.slice(0, suffixIndex)

  const targetPath = path.resolve(path.dirname(filePath), pathname)
  if (
    pathname.endsWith('.js') &&
    (outputPaths.has(targetPath) || FSE.existsSync(targetPath))
  ) {
    const base = pathname.slice(0, -3)
    const platformExtension = outputExtension.match(/^\.(native|web|ios|android)\./)?.[1]
    return platformExtension && base.endsWith(`.${platformExtension}`)
      ? `${base}.js${suffix}`
      : `${base}${outputExtension}${suffix}`
  }
  if (outputPaths.has(`${targetPath}.js`) || FSE.existsSync(`${targetPath}.js`)) {
    const platformExtension = outputExtension.match(/^\.(native|web|ios|android)\./)?.[1]
    const explicitPlatformExtension = pathname.match(/\.(native|web|ios|android)$/)?.[1]
    let extension = outputExtension
    if (explicitPlatformExtension && outputExtension === '.mjs') {
      extension = '.js'
    } else if (platformExtension && pathname.endsWith(`.${platformExtension}`)) {
      extension = outputExtension.replace(`.${platformExtension}`, '')
    }
    return `${pathname}${extension}${suffix}`
  }

  if (path.extname(pathname)) {
    return specifier
  }

  if (
    FSE.existsSync(targetPath) &&
    FSE.lstatSync(targetPath).isDirectory() &&
    FSE.existsSync(path.join(targetPath, 'index.js'))
  ) {
    return `${pathname.replace(/\/$/, '')}/index${outputExtension}${suffix}`
  }

  return specifier
}

async function fullySpecifyOutputs(outputs, { format, outputExtension }) {
  const jsOutputs = outputs.filter((file) => file?.path.endsWith('.js'))
  if (!jsOutputs.length) {
    return new Map()
  }

  const outputPaths = new Set(jsOutputs.map((file) => path.resolve(file.path)))
  const transformed = new Map()

  await Promise.all(
    jsOutputs.map(async (file) => {
      const bundle = await rolldown({
        input: file.path,
        platform: 'neutral',
        treeshake: false,
        plugins: [
          {
            name: 'tamagui-build-fully-specified',
            resolveId(id, importer) {
              if (!importer) return id
              const resolved = resolveOutputModuleSpecifier(
                id,
                file.path,
                outputExtension,
                outputPaths
              )
              return {
                id: resolved,
                external: true,
              }
            },
            load(id) {
              if (id === file.path) return file.contents
            },
          },
        ],
      })

      try {
        const result = await bundle.generate({
          format,
          codeSplitting: false,
          sourcemap: !shouldSkipSourceMaps,
          comments: true,
          minify: false,
          polyfillRequire: false,
        })
        const chunk = result.output.find(
          (output) => output.type === 'chunk' && output.facadeModuleId === file.path
        )
        if (!chunk) {
          throw new Error(`rolldown did not emit ${file.path}`)
        }

        transformed.set(file.path, {
          code: stripRolldownRegionComments(chunk.code).replace(
            /\n?\/\/# sourceMappingURL=.*(?:\n|$)/g,
            ''
          ),
          map: chunk.map || null,
        })
      } finally {
        await bundle.close?.()
      }
    })
  )

  return transformed
}

function getFullySpecifiedOutput(outputs, filePath) {
  const result = outputs.get(filePath)
  if (!result) {
    throw new Error(`rolldown did not emit ${filePath}`)
  }
  return result
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function getEnvFlag(name) {
  const value = process.env[name]
  if (!value) return false
  return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase())
}

/**
 * esbuild plugin that runs React Compiler on TS/TSX files before transformation
 */
const reactCompilerPlugin = {
  name: 'react-compiler',
  setup(build) {
    build.onLoad({ filter: /\.tsx?$/ }, async (args) => {
      const source = await FSE.readFile(args.path, 'utf8')
      const isTSX = args.path.endsWith('.tsx')

      try {
        const { transform } = require('@babel/core')
        const result = transform(source, {
          filename: args.path,
          configFile: false,
          presets: [['@babel/preset-typescript', { isTSX, allExtensions: true }]],
          plugins: [
            [
              require.resolve('babel-plugin-react-compiler'),
              {
                // Target React 19 for optimal output
                target: '19',
                // Log when functions can't be compiled and why
                logger: process.env.REACT_COMPILER_DEBUG
                  ? {
                      logEvent(filename, event) {
                        if (
                          event.kind === 'CompileError' ||
                          event.kind === 'CompileSkip'
                        ) {
                          const name = event.fnLoc?.identifierName || 'unknown'
                          const reason = event.detail?.reason || event.reason || ''
                          console.log(`[RC] ${basename(filename)}:${name} - ${reason}`)
                        }
                      },
                    }
                  : undefined,
              },
            ],
          ],
        })

        return {
          contents: result.code,
          loader: isTSX ? 'jsx' : 'js', // jsx/js since babel stripped TS
        }
      } catch (err) {
        // If React Compiler fails, fall back to original source
        console.warn(`React Compiler skipped for ${args.path}:`, err.message)
        return null // let esbuild handle it normally
      }
    })
  },
}

const shouldSwapExports = hasFlag('--swap-exports')

// when swapping exports for publish, we MUST build types (ignore --skip-types)
const shouldSkipTypes = shouldSwapExports
  ? false
  : !!(hasFlag('--skip-types') || process.env.SKIP_TYPES)

const shouldSkipNative = hasFlag('--skip-native')
const shouldSkipMJS = hasFlag('--skip-mjs')
const shouldSkipSourceMaps =
  hasFlag('--skip-sourcemaps') || getEnvFlag('TAMAGUI_BUILD_SKIP_SOURCEMAPS')
// React Compiler is disabled by default - use --react-compiler to enable
const shouldEnableCompiler = !!(hasFlag('--react-compiler') || process.env.REACT_COMPILER)
const shouldBundleFlag = hasFlag('--bundle')
const shouldBundleNodeModules = hasFlag('--bundle-modules')
const shouldClean = !!process.argv.includes('clean')
const shouldCleanBuildOnly = !!process.argv.includes('clean:build')
const shouldWatch = hasFlag('--watch')

// get command after "--" to run with swapped exports
const dashDashIndex = process.argv.indexOf('--')
const runCommandAfterSwap =
  dashDashIndex > -1 ? process.argv.slice(dashDashIndex + 1) : null

const declarationToRoot = hasFlag('--declaration-root')
const ignoreBaseUrl = hasFlag('--ignore-base-url')
const baseUrlIndex = process.argv.indexOf('--base-url')
const tsProjectIndex = process.argv.indexOf('--ts-project')
const exludeIndex = process.argv.indexOf('--exclude')
const baseUrl =
  baseUrlIndex > -1 && process.argv[baseUrlIndex + 1]
    ? process.argv[baseUrlIndex + 1]
    : null
const tsProject =
  tsProjectIndex > -1 && process.argv[tsProjectIndex + 1]
    ? process.argv[tsProjectIndex + 1]
    : null

const exclude =
  exludeIndex > -1 && process.argv[exludeIndex + 1] ? process.argv[exludeIndex + 1] : null

const pkg = FSE.readJSONSync('./package.json')
let shouldSkipInitialTypes = !!process.env.SKIP_TYPES_INITIAL
const pkgMain = pkg.main
const pkgSource = pkg.source
const pkgModule = pkg.module
const pkgModuleJSX = pkg['module:jsx']
const pkgBin = pkg.bin
const pkgTypes = Boolean(pkg.types || pkg.typings)

// build config from package.json
const buildConfig = pkg['tamagui-build'] || {}
// if bundleOnly is set, only bundle those packages (old behavior)
// otherwise bundle ALL packages by default (new behavior)
const bundleOnly = buildConfig.bundleOnly || null
// if bundleExternal is set, always keep those packages external
const bundleExternal = buildConfig.bundleExternal || null

const shouldBuildESM = Boolean(pkgModule || (!pkgMain && !pkgModuleJSX && pkgBin))
const flatOut = [pkgMain, shouldBuildESM, pkgModuleJSX].filter(Boolean).length === 1

const avoidCJS = pkgMain?.endsWith('.js')
const getJsEntryAliasPath = (entry) => {
  if (!entry) return null
  if (!path.extname(entry)) {
    return path.join(entry, 'index.js').replace(/\\/g, '/')
  }
  if (entry.endsWith('.js')) {
    return entry.replace(/\\/g, '/')
  }
  return null
}
const cjsMainAliasPath = getJsEntryAliasPath(pkgMain)
const esmAliasPaths = [
  getJsEntryAliasPath(pkgModule),
  getJsEntryAliasPath(pkgModuleJSX),
].filter(Boolean)

const replaceRNWeb = {
  esm: (content) =>
    content
      .replaceAll('from "react-native"', 'from "react-native-web"')
      .replaceAll('import "react-native";', ''),
  cjs: (content) =>
    content.replaceAll('require("react-native")', 'require("react-native-web")'),
}

let cachedConfig = null

const getProcessLabel = () => {
  const labels = {
    clean: 'clean',
    'clean:build': 'clean:build',
    watch: 'watch',
    build: 'build',
    tsc: 'build-tsc',
    js: 'build-js',
  }

  if (shouldClean) return labels.clean
  if (shouldCleanBuildOnly) return labels['clean:build']
  if (shouldWatch) return labels.watch
  if (shouldSkipTypes) return labels.js
  if (!skipJS && !jsOnly) return labels.build
  if (jsOnly) return labels.js
  if (!shouldSkipTypes && pkgTypes) return labels.tsc

  return 'Unknown'
}

const label = getProcessLabel()

process.title = `tamagui-build:${label} ${process.cwd().split('/').pop()}`

async function clean() {
  try {
    await Promise.allSettled([
      //
      FSE.remove('.turbo'),
      FSE.remove('node_modules'),
      shouldSkipTypes ? null : FSE.remove('types'),
      FSE.remove('dist'),
    ])
  } catch {
    // ok
  }
  if (shouldCleanBuildOnly) {
    console.info('🔹 cleaned', pkg.name)
    process.exit(0)
  }
  try {
    await Promise.allSettled([FSE.remove('node_modules')])
  } catch {
    // ok
  }
  console.info('🔹 cleaned', pkg.name)
  process.exit(0)
}

if (shouldClean || shouldCleanBuildOnly) {
  clean().then(() => {
    process.exit(0)
  })
} else {
  if (shouldWatch) {
    process.env.IS_WATCHING = true
    process.env.DISABLE_AUTORUN = true
    const rebuild = debounce(() => build({ cleanOutput: false }), 100)
    const chokidar = require('chokidar')

    if (!process.env.SKIP_INITIAL_BUILD) {
      // do one js build but not types
      build({
        skipTypes: true,
        cleanOutput: true,
      })
    }

    chokidar
      // prevent infinite loop but cause race condition if you just build directly
      .watch('src', {
        persistent: true,
        alwaysStat: true,
        ignoreInitial: true,
      })
      .on('change', rebuild)
      .on('add', rebuild)
  } else {
    build()
      .then(async () => {
        if (!shouldSwapExports) return

        // swap exports.types from ./src to ./types
        const swapped = swapExportsTypes(pkg, 'to-dist')
        if (swapped) {
          await FSE.writeJSON('./package.json', pkg, { spaces: 2 })
          console.info('swapped exports.types to dist')
        }

        // run command after -- if given, then swap back
        if (runCommandAfterSwap && runCommandAfterSwap.length > 0) {
          const command = runCommandAfterSwap.join(' ')
          console.info(`running: ${command}`)
          let exitCode = 0
          try {
            childProcess.execSync(command, { stdio: 'inherit' })
          } catch (err) {
            // execSync throws on non-zero exit
            exitCode = err.status ?? 1
          } finally {
            if (swapped) {
              swapExportsTypes(pkg, 'to-src')
              await FSE.writeJSON('./package.json', pkg, { spaces: 2 })
              console.info('swapped exports.types back to src')
            }
          }
          process.exit(exitCode)
        }
      })
      .catch(async (error) => {
        // try to restore on error if we were swapping
        if (shouldSwapExports) {
          try {
            const freshPkg = await FSE.readJSON('./package.json')
            swapExportsTypes(freshPkg, 'to-src')
            await FSE.writeJSON('./package.json', freshPkg, { spaces: 2 })
          } catch {
            // ignore restore errors
          }
        }
        console.error(error)
        process.exit(1)
      })
  }
}

// stores original src paths so we can restore exactly (keyed by json path)
const originalExportTypes = new Map()

/**
 * swaps "types" fields in exports between src and dist
 * handles nested conditions like { "react-native": { "types": "..." } }
 * @param {object} pkg - package.json object (mutated in place)
 * @param {'to-dist' | 'to-src'} direction
 * @returns {boolean} true if any swaps were made
 */
function swapExportsTypes(pkg, direction) {
  let swapped = false

  // handle top-level "types" field
  if (pkg.types && typeof pkg.types === 'string') {
    if (direction === 'to-dist' && pkg.types.startsWith('./src/')) {
      originalExportTypes.set('pkg.types', pkg.types)
      pkg.types = pkg.types.replace(/^\.\/src\//, './types/').replace(/\.tsx?$/, '.d.ts')
      swapped = true
    } else if (direction === 'to-src') {
      const original = originalExportTypes.get('pkg.types')
      if (original) {
        pkg.types = original
        swapped = true
      }
    }
  }

  if (!pkg.exports) return swapped

  function walk(obj, pathKey) {
    if (!obj || typeof obj !== 'object') return

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = pathKey ? `${pathKey}.${key}` : key

      if (key === 'types' && typeof value === 'string') {
        if (direction === 'to-dist' && value.startsWith('./src/')) {
          // store original for restore
          originalExportTypes.set(currentPath, value)
          // ./src/index.ts -> ./types/index.d.ts
          obj.types = value.replace(/^\.\/src\//, './types/').replace(/\.tsx?$/, '.d.ts')
          swapped = true
        } else if (direction === 'to-src') {
          const original = originalExportTypes.get(currentPath)
          if (original) {
            obj.types = original
            swapped = true
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        // recurse into nested conditions
        walk(value, currentPath)
      }
    }
  }

  walk(pkg.exports, '')
  return swapped
}

async function build({ skipTypes, cleanOutput = !shouldWatch } = {}) {
  if (process.env.DEBUG) console.info('🔹', pkg.name)
  try {
    const start = Date.now()
    const isSkippingTypesForBuild = Boolean(skipTypes || shouldSkipTypes || !pkgTypes)

    if (cleanOutput) {
      await Promise.allSettled([
        FSE.remove('dist'),
        isSkippingTypesForBuild ? null : FSE.remove('types'),
      ])
    }

    const allFiles = (await fastGlob(['src/**/*.(m)?[jt]s(x)?', 'src/**/*.css'])).filter(
      (x) =>
        !x.includes('.d.ts') &&
        !/(?:^|\/)(?:__tests__|tests?)(?:\/|$)/.test(x) &&
        !/\.(?:test-d|test|spec)\.[cm]?[jt]sx?$/.test(x) &&
        (exclude ? !x.match(exclude) : true)
    )

    await Promise.all([
      //
      skipTypes ? null : buildTsc(allFiles.filter((x) => /\.tsx?$/.test(x))),
      buildJs(allFiles),
    ])

    console.info('built', pkg.name, 'in', Date.now() - start, 'ms')

    // Run afterBuild script if defined
    await runAfterBuild()
  } catch (error) {
    printBuildError(error, pkg.name, process.cwd())
    if (!shouldWatch) {
      process.exit(1)
    }
  }
}

async function runAfterBuild() {
  const afterBuild = pkg.scripts?.afterBuild
  if (!afterBuild) return

  try {
    console.info('Running afterBuild script...')
    const start = Date.now()

    childProcess.execSync(afterBuild, {
      stdio: 'inherit',
      cwd: process.cwd(),
    })

    console.info('afterBuild completed in', Date.now() - start, 'ms')
  } catch (error) {
    console.error('afterBuild failed:', error.message)
    if (!shouldWatch) {
      throw error
    }
  }
}

async function buildTsc(allFiles) {
  if (!pkgTypes || jsOnly || shouldSkipTypes) return
  if (shouldSkipInitialTypes) {
    shouldSkipInitialTypes = false
    return
  }

  const targetDir = './types'
  await FSE.ensureDir(targetDir)

  try {
    const { config, error } = await loadTsConfig()
    if (error) throw error

    if (config.options.isolatedDeclarations) {
      const oxc = await import('oxc-transform')

      const results = await Promise.all(
        allFiles.map(async (file) => {
          const source = await FSE.readFile(file, 'utf-8')
          const { code, map, errors } = await oxc.isolatedDeclaration(file, source, {
            sourcemap: !shouldSkipSourceMaps,
          })

          if (errors && errors.length > 0) {
            return errors
          }

          const dtsPath = path
            .join(`types`, ...file.split('/').slice(1))
            .replace(/\.tsx?$/, '.d.ts')
          const mapPath = `${dtsPath}.map`

          const output = shouldSkipSourceMaps
            ? code
            : `${code}\n//# sourceMappingURL=${path.basename(mapPath)}`
          await FSE.ensureDir(dirname(dtsPath))
          await writeIfUnchanged(dtsPath, output)
          if (!shouldSkipSourceMaps && map) {
            await writeIfUnchanged(mapPath, JSON.stringify(map, null, 2))
          } else {
            await FSE.remove(mapPath)
          }

          return []
        })
      )

      const allErrors = results.flat()

      if (allErrors.length > 0) {
        printOxcErrors(allErrors)
        if (!shouldWatch) {
          process.exit(1)
        }
      }

      return
    }

    await emitDeclarationsWithTsgo(targetDir, allFiles)
  } catch (err) {
    printTypescriptCompilationError(err, pkg.name)
    if (!shouldWatch) {
      process.exit(1)
    }
  } finally {
    await FSE.remove('tsconfig.tsbuildinfo')
  }
}

async function emitDeclarationsWithTsgo(targetDir, allFiles) {
  const tsgoPath = getTypeScriptNativePath()
  const declarationProject = `.tamagui-build-tsconfig-${process.pid}.json`
  const sourceProject = path
    .relative(process.cwd(), path.resolve(tsProject || 'tsconfig.json'))
    .replaceAll(path.sep, '/')
  await FSE.writeJSON(
    declarationProject,
    {
      extends: sourceProject.startsWith('.') ? sourceProject : `./${sourceProject}`,
      files: allFiles,
      include: [],
      exclude: [],
    },
    { spaces: 2 }
  )
  await FSE.remove('tsconfig.tsbuildinfo')
  const args = [
    '--project',
    declarationProject,
    '--declaration',
    '--emitDeclarationOnly',
    '--declarationMap',
    String(!shouldSkipSourceMaps),
    '--outDir',
    targetDir,
    '--rootDir',
    'src',
    '--tsBuildInfoFile',
    'tsconfig.tsbuildinfo',
  ]

  if (declarationToRoot) {
    args.push('--declarationDir', './')
  }
  if (!ignoreBaseUrl && baseUrl) {
    args.push('--baseUrl', path.resolve(baseUrl))
  }

  try {
    await new Promise((resolve, reject) => {
      const child = childProcess.spawn(tsgoPath, args, { stdio: 'inherit' })
      child.once('error', reject)
      child.once('exit', (code, signal) => {
        if (code === 0) {
          resolve()
          return
        }
        reject(
          new Error(
            signal
              ? `TypeScript native declaration emit stopped by ${signal}`
              : `TypeScript native declaration emit exited with code ${code}`
          )
        )
      })
    })
  } finally {
    await FSE.remove(declarationProject)
  }

  const declarationRoot = declarationToRoot ? '.' : targetDir
  await Promise.all(
    allFiles.map(async (file) => {
      const relativeFile = path.relative(path.resolve('src'), path.resolve(file))
      const declarationPath = path
        .join(declarationRoot, relativeFile)
        .replace(/\.tsx?$/, '.d.ts')
      const output = await FSE.readFile(declarationPath, 'utf8')
      const normalized = output.replace(
        /(["'])@tamagui\/([^/"']+)\/types\1/g,
        '$1@tamagui/$2$1'
      )
      if (normalized !== output) {
        await writeIfUnchanged(declarationPath, normalized)
      }
    })
  )
}

async function loadTsConfig() {
  if (cachedConfig && shouldWatch) {
    return cachedConfig
  }

  const result = getTsconfig(process.cwd(), tsProject || 'tsconfig.json')
  if (!result) {
    return { error: new Error("Could not find a valid 'tsconfig.json'.") }
  }

  cachedConfig = { config: { options: result.config.compilerOptions || {} } }
  return cachedConfig
}

async function buildJs(allFiles) {
  if (skipJS) {
    return
  }

  const externalPlugin = createExternalPlugin({
    skipNodeModulesBundle: true,
  })

  // packages that must always stay external (need runtime access to files/wasm/native bindings)
  const alwaysExternal = ['esbuild-wasm', '@swc/core']

  const bundlePlugin = {
    name: `bundle-all-modules`,
    setup(build) {
      // Alias esbuild to esbuild-wasm (but keep it external)
      build.onResolve({ filter: /^esbuild$/ }, () => {
        return { path: 'esbuild-wasm', external: true }
      })

      build.onResolve({ filter: /.*/ }, (args) => {
        // Externalize node built-ins
        if (args.path.startsWith('node:')) {
          return { external: true }
        }

        if (!args.path.startsWith('.') && !args.path.startsWith('/')) {
          // Always keep these external (need runtime file access)
          if (
            alwaysExternal.some(
              (pkg) => args.path === pkg || args.path.startsWith(pkg + '/')
            )
          ) {
            return { external: true }
          }

          // If bundleExternal is set, keep those packages external
          if (bundleExternal) {
            if (
              bundleExternal.some(
                (pkg) => args.path === pkg || args.path.startsWith(pkg + '/')
              )
            ) {
              return { external: true }
            }
          }

          // If bundleOnly is set, only bundle those specific packages
          if (bundleOnly) {
            if (
              bundleOnly.some(
                (pkg) => args.path === pkg || args.path.startsWith(pkg + '/')
              )
            ) {
              return { external: false }
            }
            return { external: true }
          }

          // Default: bundle ALL packages
          return { external: false }
        }
      })
    },
  }

  const external = shouldBundleFlag ? ['@swc/*', '*.node'] : undefined

  const start = Date.now()

  const entryPoints = shouldBundleFlag ? [pkgSource || './src/index.ts'] : allFiles

  const cjsConfig = {
    format: 'cjs',
    entryPoints,
    outdir: flatOut ? 'dist' : 'dist/cjs',
    bundle: shouldBundleFlag,
    external,
    plugins: shouldBundleNodeModules ? [bundlePlugin] : [externalPlugin],
    minify: !!process.env.MINIFY,
    platform: 'node',
  }

  const cjsConfigWeb = cjsConfig

  const esmConfig = {
    target: 'esnext',
    format: 'esm',
    entryPoints,
    bundle: shouldBundleFlag,
    outdir: flatOut ? 'dist' : 'dist/esm',
    allowOverwrite: true,
    minify: !!process.env.MINIFY,
  }

  if (pkgSource) {
    try {
      const contents = await FSE.readFile(pkgSource)
      if (contents.slice(0, 40).includes('GITCRYPT')) {
        // encrypted file, ignore
        console.info(`This package is encrypted, skipping`)
        return
      }
    } catch {
      // ok
    }
  }

  return await Promise.all([
    // web output to cjs
    pkgMain
      ? esbuildWriteIfChanged(cjsConfigWeb, {
          platform: 'web',
          bundle: shouldBundleFlag,
          specifyCJS: !avoidCJS,
          keepJsOutput: avoidCJS,
          preserveJsPaths: [],
        })
      : null,

    // native output to cjs
    pkgMain && !shouldSkipNative
      ? esbuildWriteIfChanged(cjsConfig, {
          platform: 'native',
        })
      : null,

    // web output to esm
    shouldBuildESM
      ? esbuildWriteIfChanged(esmConfig, {
          platform: 'web',
          bundle: shouldBundleFlag,
          preserveJsPaths: esmAliasPaths,
        })
      : null,

    // native output to esm
    shouldBuildESM && !shouldSkipNative
      ? esbuildWriteIfChanged(esmConfig, {
          platform: 'native',
        })
      : null,

    // jsx web
    pkgModuleJSX
      ? esbuildWriteIfChanged(
          {
            // only diff is jsx preserve and outdir
            jsx: 'preserve',
            outdir: flatOut ? 'dist' : 'dist/jsx',
            entryPoints,
            bundle: shouldBundleFlag,
            allowOverwrite: true,
            target: 'esnext',
            format: 'esm',
            minify: !!process.env.MINIFY,
            platform: 'neutral',
          },
          {
            platform: 'web',
            preserveJsPaths: esmAliasPaths,
          }
        )
      : null,

    // jsx native
    pkgModuleJSX && !shouldSkipNative
      ? esbuildWriteIfChanged(
          {
            // only diff is jsx preserve and outdir
            jsx: 'preserve',
            outdir: flatOut ? 'dist' : 'dist/jsx',
            entryPoints,
            bundle: shouldBundleFlag,
            allowOverwrite: true,
            target: 'node16',
            format: 'esm',
            minify: !!process.env.MINIFY,
            platform: 'neutral',
          },
          {
            platform: 'native',
          }
        )
      : null,
  ]).then(() => {
    if (process.env.DEBUG) {
      console.info(`built js in ${Date.now() - start}ms`)
    }

    void esbuild.stop()
  })
}

/**
 * esbuild but avoids touching unchanged files to not freak out vite
 * @param {esbuild.BuildOptions} opts
 * @returns {Promise<void>}
 */
async function esbuildWriteIfChanged(
  /** @type { import('esbuild').BuildOptions } */
  opts,
  { platform, env, specifyCJS, keepJsOutput, preserveJsPaths } = {
    platform: '',
    specifyCJS: false,
    keepJsOutput: false,
    preserveJsPaths: [],
    env: '',
  }
) {
  if (!platform) {
    throw new Error(`Must provide platform of web or native`)
  }

  const isESM = opts.target === 'esm' || opts.target === 'esnext'
  const preserveJsPathSet = new Set((preserveJsPaths || []).filter(Boolean))
  const preserveJsPathAbsoluteSet = new Set(
    [...preserveJsPathSet].map((preserveJsPath) => path.resolve(preserveJsPath))
  )

  const buildSettings = (() => {
    // compat with jsx and hermes back a few versions generally:
    /** @type { import('esbuild').BuildOptions } */
    const nativeEsbuildSettings = {
      target: 'esnext',
      supported: {
        'logical-assignment': false,
      },
      jsx: 'automatic',
      platform: 'neutral',
    }

    /** @type { import('esbuild').BuildOptions } */
    const webEsbuildSettings = {
      target: 'esnext',
      jsx: 'automatic',
      platform: opts.bundle ? 'node' : 'neutral',
      tsconfigRaw: {
        compilerOptions: {
          paths: {
            'react-native': ['react-native-web'],
          },
        },
      },
    }

    /** @type { import('esbuild').BuildOptions } */
    const out = {
      ...opts,

      conditions: platform === 'native' ? ['react-native'] : [],
      mainFields: isESM ? ['import', 'module', 'main'] : ['require', 'main'],

      plugins: [
        ...(opts.plugins || []),

        // React Compiler for automatic memoization (disabled by default, enable with --react-compiler)
        ...(shouldEnableCompiler ? [reactCompilerPlugin] : []),

        ...(platform === 'native' && !opts.bundle
          ? [
              // class isnt supported by hermes
              es5Plugin(),
            ]
          : []),
      ].filter(Boolean),

      format: isESM ? 'esm' : 'cjs',

      treeShaking: true,
      // We only want TAMAGUI_TARGET dead-code elimination during normal builds.
      // Syntax minification can legally rewrite statements into comma expressions.
      minifySyntax: false,
      write: false,

      color: true,
      allowOverwrite: true,
      keepNames: false,
      sourcemap: !shouldSkipSourceMaps,
      sourcesContent: false,
      logLevel: 'error',
      ...(platform === 'native' && nativeEsbuildSettings),
      ...(platform === 'web' && webEsbuildSettings),
      define: {
        ...(env && {
          'process.env.NODE_ENV': `"${env}"`,
        }),
        ...(shouldBundleNodeModules && {
          'process.env.ESBUILD_BINARY_PATH': `"true"`,
        }),
        // vite-compatible env vars for tree-shaking
        'import.meta.env.VITE_NATIVE': platform === 'native' ? 'true' : 'false',
        ...opts.define,
      },
    }

    return out
  })()

  let built

  try {
    built = await esbuild.build(buildSettings)
  } catch (err) {
    printEsbuildError(err)
    if (!shouldWatch) {
      process.exit(1)
    }
  }

  if (!built.outputFiles) {
    return
  }

  const nativeFilesMap = {}
  const webFilesMap = {}

  for (const p of built.outputFiles) {
    if (p.path.includes('.native.js')) {
      nativeFilesMap[p.path] = true
    } else if (p.path.includes('.web.js')) {
      webFilesMap[p.path] = true
    }
  }

  const cleanupNonMjsFiles = []
  const cleanupNonCjsFiles = []

  const flush = writeIfUnchanged

  const outputs = (
    await Promise.all(
      built.outputFiles.map(async (file) => {
        let path = file.path

        const isMap = path.endsWith('.js.map')

        if (path.endsWith('.js') || isMap) {
          const [_, extPlatform] =
            path.match(/(web|native|ios|android)\.js(\.map)?$/) ?? []

          if (platform === 'native') {
            if (!extPlatform && nativeFilesMap[path.replace('.js', '.native.js')]) {
              // if native exists, avoid outputting non-native
              return
            }

            if (extPlatform === 'web') {
              return
            }

            if (!extPlatform) {
              path = path.replace('.js', '.native.js')
            }
          }

          if (platform === 'web') {
            if (
              extPlatform === 'native' ||
              extPlatform === 'android' ||
              extPlatform === 'ios'
            ) {
              return
            }
            if (extPlatform === 'web') {
              // we move web to just .js
              path = path.replace('.web.js', '.js')
            }
            const webSpecific = webFilesMap[path.replace('.js', '.web.js')]
            if (!extPlatform && webSpecific) {
              // swap into the non-web exntesion
              return
            }
          }
        }

        let contents = new TextDecoder().decode(file.contents)

        if (platform === 'web') {
          const rnWebReplacer = replaceRNWeb[opts.format]
          if (rnWebReplacer) {
            contents = rnWebReplacer(contents)
          }
        }

        if (!isMap && path.endsWith('.js')) {
          const hadTamaguiTarget = contents.includes('process.env.TAMAGUI_TARGET')
          contents = dceTamaguiTarget(contents, {
            format: opts.format,
            jsx: opts.jsx,
            platform,
          })

          if (isESM && hadTamaguiTarget) {
            contents = await pruneUnusedImports(contents, path)
          }

          // expose esbuild's require shim so rolldown can resolve and rewrite local
          // specifiers. rolldown restores the shim for web esm, while the native output
          // below keeps a real require for metro.
          if (isESM) {
            contents = contents.replaceAll('__require(', 'require(')
          }
        }

        if (isESM && pkg.sideEffects !== true && pkg.sideEffects !== undefined) {
          const sideEffects = pkg.sideEffects
          // sideEffects: false means nothing has side effects, strip all bare imports
          // sideEffects: ["*.css", ...] means only matching files have side effects

          const result = []
          const lines = contents.split('\n')
          for (const line of lines) {
            // only process bare imports: import "...";
            const match = line.match(/^import\s+["']([^"']+)["'];?$/)
            if (!match) {
              result.push(line)
              continue
            }
            // sideEffects: false → strip all bare imports
            if (sideEffects === false) {
              result.push('')
              continue
            }
            // sideEffects: [...] → keep if specifier matches any pattern
            const hasSideEffect = sideEffectsMatch(sideEffects, match[1])
            result.push(hasSideEffect ? line : '')
          }

          contents = result.join('\n')
        }

        // write the file (only if changed), but always return file info for further processing
        await flush(path, contents)
        if (!isMap) {
          return {
            path,
            contents,
          }
        }
      })
    )
  ).filter(Boolean)

  // path specifics:

  // write first so we can find them in next loop with specify
  await Promise.all(
    outputs.map(async (file) => {
      if (!file) return
      const { path, contents } = file
      // write it without specifics to just .js for older react-native compat
      await flush(path, contents)
    })
  )

  if (specifyCJS) {
    const transformedOutputs = opts.bundle
      ? new Map()
      : await fullySpecifyOutputs(outputs, {
          format: 'cjs',
          outputExtension: platform === 'native' ? '.native.cjs' : '.cjs',
        })

    await Promise.all(
      outputs.map(async (file) => {
        if (!file) return
        const { path, contents } = file
        if (!path.endsWith('.js')) return

        const result = opts.bundle
          ? { code: contents }
          : getFullySpecifiedOutput(transformedOutputs, path)

        const shouldPreserveJsAlias =
          preserveJsPathSet.has(path) || preserveJsPathAbsoluteSet.has(path)

        if (!shouldPreserveJsAlias) {
          cleanupNonCjsFiles.push(path)
          cleanupNonCjsFiles.push(path + '.map')
        }

        await flush(path.replace(/\.js$/, '.cjs'), result.code)

        if (shouldPreserveJsAlias) {
          await flush(path, result.code)
        }
      })
    )
    if (cleanupNonCjsFiles.length) {
      await Promise.all(cleanupNonCjsFiles.map(async (file) => FSE.remove(file)))
    }
    return
  }

  if (keepJsOutput) {
    return
  }

  // Skip mjs transformation if --skip-mjs flag is set
  if (shouldSkipMJS) {
    return
  }

  const transformedOutputs = opts.bundle
    ? new Map()
    : await fullySpecifyOutputs(outputs, {
        format: isESM ? 'esm' : 'cjs',
        outputExtension: platform === 'native' ? '.native.js' : '.mjs',
      })

  await Promise.all(
    outputs.map(async (file) => {
      if (!file) return

      const { path, contents } = file

      if (!path.endsWith('.js')) return

      // for web do mjs, for native keep js since rollup gets confused when you have both
      const newOutPath = platform === 'native' ? path : path.replace('.js', '.mjs')

      // if bundling no need to specify as its all internal
      // and babel is bad on huge bundled files
      const result = opts.bundle
        ? { code: contents }
        : getFullySpecifiedOutput(transformedOutputs, path)

      if (platform === 'native' && isESM) {
        result.code = result.code.replace(/\b__require(?:\$\d+)?\(/g, 'require(')
      }

      if (platform === 'native' && !isESM && !avoidCJS) {
        await flush(path.replace(/\.js$/, '.cjs'), result.code)
      }

      const shouldPreserveJsAlias =
        preserveJsPathSet.has(path) || preserveJsPathAbsoluteSet.has(path)

      if (!path.includes('.native.') && !shouldPreserveJsAlias) {
        cleanupNonMjsFiles.push(path)
        cleanupNonMjsFiles.push(path + '.map')
      }

      // output to mjs fully specified
      await flush(
        newOutPath,
        result.code +
          (result.map && !shouldSkipSourceMaps
            ? `\n//# sourceMappingURL=${basename(newOutPath)}.map\n`
            : '')
      )
      if (result.map && !shouldSkipSourceMaps) {
        await flush(newOutPath + '.map', JSON.stringify(result.map))
      } else {
        await FSE.remove(newOutPath + '.map')
      }

      if (shouldPreserveJsAlias) {
        await flush(
          path,
          result.code +
            (result.map && !shouldSkipSourceMaps
              ? `\n//# sourceMappingURL=${basename(path)}.map\n`
              : '')
        )
        if (result.map && !shouldSkipSourceMaps) {
          await flush(path + '.map', JSON.stringify(result.map))
        } else {
          await FSE.remove(path + '.map')
        }
      }
    })
  )

  // remove intermediary .js files once the final .mjs/.cjs outputs exist
  if (cleanupNonMjsFiles.length || cleanupNonCjsFiles.length) {
    await Promise.all(
      [...cleanupNonMjsFiles, ...cleanupNonCjsFiles].map(async (file) => {
        await FSE.remove(file)
      })
    )
  }
}
