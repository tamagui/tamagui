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

const { transform } = require('@babel/core')
const FSE = require('fs-extra')
const esbuild = require('esbuild')
const fastGlob = require('fast-glob')
const createExternalPlugin = require('./externalNodePlugin')
const debounce = require('lodash.debounce')
const { basename, dirname } = require('node:path')
const { es5Plugin } = require('./esbuild-es5')
const ts = require('typescript')
const path = require('node:path')
const childProcess = require('node:child_process')
const {
  printTypescriptDiagnostics,
  printEsbuildError,
  printBuildError,
  printTypescriptCompilationError,
} = require('./pretty-print-errors')

const jsOnly = !!process.env.JS_ONLY
const skipJS = !!(process.env.SKIP_JS || false)

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
        const result = transform(source, {
          filename: args.path,
          configFile: false,
          presets: [
            ['@babel/preset-typescript', { isTSX, allExtensions: true }],
          ],
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
                        if (event.kind === 'CompileError' || event.kind === 'CompileSkip') {
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

const shouldSkipTypes = !!(
  process.argv.includes('--skip-types') || process.env.SKIP_TYPES
)

const shouldSkipNative = !!process.argv.includes('--skip-native')
const shouldSkipMJS = !!process.argv.includes('--skip-mjs')
// React Compiler is disabled by default - use --react-compiler to enable
const shouldEnableCompiler = !!(
  process.argv.includes('--react-compiler') || process.env.REACT_COMPILER
)
const shouldBundleFlag = !!process.argv.includes('--bundle')
const shouldBundleNodeModules = !!process.argv.includes('--bundle-modules')
const shouldClean = !!process.argv.includes('clean')
const shouldCleanBuildOnly = !!process.argv.includes('clean:build')
const shouldWatch = process.argv.includes('--watch')
const shouldSwapExports = process.argv.includes('--swap-exports')

// get command after "--" to run with swapped exports
const dashDashIndex = process.argv.indexOf('--')
const runCommandAfterSwap = dashDashIndex > -1 ? process.argv.slice(dashDashIndex + 1) : null

const declarationToRoot = !!process.argv.includes('--declaration-root')
const ignoreBaseUrl = process.argv.includes('--ignore-base-url')
const baseUrlIndex = process.argv.indexOf('--base-url')
const tsProjectIndex = process.argv.indexOf('--ts-project')
const exludeIndex = process.argv.indexOf('--exclude')
const baseUrl =
  baseUrlIndex > -1 && process.argv[baseUrlIndex + 1]
    ? process.argv[baseUrlIndex + 1]
    : '.'
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
const pkgTypes = Boolean(pkg.types || pkg.typings)
const pkgRemoveSideEffects = pkg.removeSideEffects || false

// build config from package.json
const buildConfig = pkg['tamagui-build'] || {}
// if bundleOnly is set, only bundle those packages (old behavior)
// otherwise bundle ALL packages by default (new behavior)
const bundleOnly = buildConfig.bundleOnly || null
// if bundleExternal is set, always keep those packages external
const bundleExternal = buildConfig.bundleExternal || null

const flatOut = [pkgMain, pkgModule, pkgModuleJSX].filter(Boolean).length === 1

const avoidCJS = pkgMain?.endsWith('.js')

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
      FSE.remove('types'),
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
    const rebuild = debounce(build, 100)
    const chokidar = require('chokidar')

    if (!process.env.SKIP_INITIAL_BUILD) {
      // do one js build but not types
      build({
        skipTypes: true,
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
    build().then(async () => {
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
    }).catch(async (error) => {
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
  if (!pkg.exports) return false

  let swapped = false

  function walk(obj, pathKey) {
    if (!obj || typeof obj !== 'object') return

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = pathKey ? `${pathKey}.${key}` : key

      if (key === 'types' && typeof value === 'string') {
        if (direction === 'to-dist' && value.startsWith('./src/')) {
          // store original for restore
          originalExportTypes.set(currentPath, value)
          // ./src/index.ts -> ./types/index.d.ts
          obj.types = value
            .replace(/^\.\/src\//, './types/')
            .replace(/\.tsx?$/, '.d.ts')
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

async function build({ skipTypes } = {}) {
  if (process.env.DEBUG) console.info('🔹', pkg.name)
  try {
    const start = Date.now()

    const allFiles = (await fastGlob(['src/**/*.(m)?[jt]s(x)?', 'src/**/*.css'])).filter(
      (x) => !x.includes('.d.ts') && (exclude ? !x.match(exclude) : true)
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

    // much slower
    // if (config.options.isolatedDeclarations) {
    //   console.info(
    //     childProcess
    //       .execSync(`npx tsgo --project ./tsconfig.json --emitDeclarationOnly`)
    //       .toString()
    //   )
    //   return
    // }

    const compilerOptions = createCompilerOptions(config.options, targetDir)

    if (config.options.isolatedDeclarations) {
      const oxc = require('oxc-transform')

      await Promise.all(
        allFiles.map(async (file) => {
          const source = await FSE.readFile(file, 'utf-8')
          const { code, map } = oxc.isolatedDeclaration(file, source, {
            sourcemap: true,
          })

          const dtsPath = path
            .join(`types`, ...file.split('/').slice(1))
            .replace(/\.tsx?$/, '.d.ts')
          const mapPath = `${dtsPath}.map`

          const output = `${code}\n//# sourceMappingURL=${path.basename(mapPath)}`
          await FSE.ensureDir(dirname(dtsPath))
          await Promise.all([
            FSE.writeFile(dtsPath, output),
            FSE.writeFile(mapPath, JSON.stringify(map, null, 2)),
          ])
        })
      )

      return
    }

    const { program, emitResult, diagnostics } = await compileTypeScript(
      config.fileNames,
      compilerOptions
    )

    // exit on errors
    if (diagnostics.some((x) => x.code) && !shouldWatch) {
      printTypescriptDiagnostics(diagnostics, ts)
      if (shouldWatch) {
        return
      }
      process.exit(1)
    }

    reportDiagnostics(diagnostics)

    if (emitResult.emitSkipped) {
      throw new Error('TypeScript compilation failed')
    }
  } catch (err) {
    printTypescriptCompilationError(err, pkg.name)
    if (!shouldWatch) {
      process.exit(1)
    }
  } finally {
    await FSE.remove('tsconfig.tsbuildinfo')
  }
}

async function loadTsConfig() {
  if (cachedConfig && shouldWatch) {
    return cachedConfig
  }

  const configPath = ts.findConfigFile(
    './',
    ts.sys.fileExists,
    tsProject || 'tsconfig.json'
  )
  if (!configPath) {
    return { error: new Error("Could not find a valid 'tsconfig.json'.") }
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error) {
    return {
      error: new Error(`Error reading tsconfig.json: ${configFile.error.messageText}`),
    }
  }

  const parsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  )

  if (parsedCommandLine.errors.length) {
    return {
      error: new Error(
        `Error parsing tsconfig.json: ${ts.formatDiagnostics(parsedCommandLine.errors, formatHost)}`
      ),
    }
  }

  cachedConfig = { config: parsedCommandLine }
  return cachedConfig
}

function createCompilerOptions(baseOptions, targetDir) {
  const compilerOptions = {
    ...baseOptions,
    declaration: true,
    emitDeclarationOnly: true,
    declarationMap: true,
    outDir: targetDir,
    rootDir: 'src',
    incremental: true,
    tsBuildInfoFile: 'tsconfig.tsbuildinfo',
  }

  if (declarationToRoot) {
    compilerOptions.declarationDir = './'
  }

  if (!ignoreBaseUrl) {
    compilerOptions.baseUrl = baseUrl
  }

  return compilerOptions
}

async function compileTypeScript(fileNames, options) {
  const program = ts.createProgram(fileNames, options)
  const emitResult = program.emit()
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  return { program, emitResult, diagnostics: allDiagnostics }
}

const formatHost = {
  getCanonicalFileName: (path) => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
}

function reportDiagnostics(diagnostics) {
  diagnostics.forEach((diagnostic) => {
    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    if (diagnostic.file && diagnostic.start !== undefined) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      )
      message = `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
    }
    console.error(message)
  })
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
        })
      : null,

    // native output to cjs
    pkgMain && !shouldSkipNative
      ? esbuildWriteIfChanged(cjsConfig, {
          platform: 'native',
        })
      : null,

    // web output to esm
    pkgModule
      ? esbuildWriteIfChanged(esmConfig, {
          platform: 'web',
          bundle: shouldBundleFlag,
        })
      : null,

    // native output to esm
    pkgModule && !shouldSkipNative
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
  { platform, env, specifyCJS } = {
    platform: '',
    specifyCJS: false,
    env: '',
  }
) {
  if (!platform) {
    throw new Error(`Must provide platform of web or native`)
  }

  const isESM = opts.target === 'esm' || opts.target === 'esnext'

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
      minifySyntax: true,
      write: false,

      color: true,
      allowOverwrite: true,
      keepNames: false,
      sourcemap: true,
      sourcesContent: false,
      logLevel: 'error',
      ...(platform === 'native' && nativeEsbuildSettings),
      ...(platform === 'web' && webEsbuildSettings),
      define: {
        ...(platform && {
          'process.env.TAMAGUI_TARGET': `"${platform}"`,
        }),
        ...(env && {
          'process.env.NODE_ENV': `"${env}"`,
        }),
        ...(shouldBundleNodeModules && {
          'process.env.ESBUILD_BINARY_PATH': `"true"`,
        }),
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

  async function flush(path, contents) {
    if (shouldWatch) {
      if (
        !(await FSE.pathExists(path)) ||
        (await FSE.readFile(path, 'utf8')) !== contents
      ) {
        await FSE.outputFile(path, contents, 'utf8')
        return true
      }
    } else {
      await FSE.outputFile(path, contents, 'utf8')
      return true
    }
  }

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

        if (pkgRemoveSideEffects && isESM) {
          const allowedSideEffects = pkg.sideEffects || []

          const result = []
          const lines = contents.split('\n')
          for (const line of lines) {
            if (
              !line.startsWith('import ') ||
              allowedSideEffects.some((allowed) => line.includes(allowed))
            ) {
              result.push(line)
              continue
            }
            result.push(line.replace(/import "[^"]+";/g, ''))
          }

          // match whitespace to preserve sourcemaps
          contents = result.join('\n')
        }

        // only if writes + not map do we continue to specification
        if (await flush(path, contents)) {
          if (!isMap) {
            return {
              path,
              contents,
            }
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
      await FSE.writeFile(path, contents)
    })
  )

  if (specifyCJS) {
    await Promise.all(
      outputs.map(async (file) => {
        if (!file) return
        const { path, contents } = file
        if (!path.endsWith('.js')) return

        const result = opts.bundle
          ? { code: contents }
          : transform(contents, {
              filename: path,
              configFile: false,
              sourceMap: true,
              plugins: [
                [
                  require.resolve('@tamagui/babel-plugin-fully-specified/commonjs'),
                  {
                    esExtensionDefault: platform === 'native' ? '.native.cjs' : '.cjs',
                  },
                ],
              ].filter(Boolean),
            })

        cleanupNonCjsFiles.push(path)

        await FSE.writeFile(path.replace(/\.js$/, '.cjs'), result.code)
      })
    )
    return
  }

  // Skip mjs transformation if --skip-mjs flag is set
  if (shouldSkipMJS) {
    return
  }

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
        : transform(contents, {
            filename: newOutPath,
            configFile: false,
            sourceMap: true,
            plugins: [
              [
                isESM
                  ? require.resolve('@tamagui/babel-plugin-fully-specified')
                  : require.resolve('@tamagui/babel-plugin-fully-specified/commonjs'),
                {
                  esExtensionDefault: platform === 'native' ? '.native.js' : '.mjs',
                  esExtensions: platform === 'native' ? ['.js'] : ['.mjs'],
                },
              ],
            ].filter(Boolean),
          })

      if (!path.includes('.native.')) {
        cleanupNonMjsFiles.push(path)
        cleanupNonMjsFiles.push(path + '.map')
      }

      // output to mjs fully specified
      if (
        await flush(
          newOutPath,
          result.code +
            (result.map ? `\n//# sourceMappingURL=${basename(newOutPath)}.map\n` : '')
        )
      ) {
        if (result.map) {
          await FSE.writeFile(newOutPath + '.map', JSON.stringify(result.map), 'utf8')
        }
      }
    })
  )

  // if we do mjs we should remove js after to avoid bloat
  if (
    process.env.TAMAGUI_BUILD_REMOVE_ESM_JS_FILES ||
    process.env.TAMAGUI_BUILD_CLEANUP_JS_FILES
  ) {
    if (cleanupNonMjsFiles.length) {
      await Promise.all(
        [...cleanupNonMjsFiles, ...cleanupNonCjsFiles].map(async (file) => {
          await FSE.remove(file)
        })
      )
    }
  }
}
