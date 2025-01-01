#!/usr/bin/env node
/* eslint-disable no-console */

const { transform } = require('@babel/core')
const FSE = require('fs-extra')
const esbuild = require('esbuild')
const fg = require('fast-glob')
const createExternalPlugin = require('./externalNodePlugin')
const debounce = require('lodash.debounce')
const { basename, dirname } = require('node:path')
const alias = require('./esbuildAliasPlugin')
const { es5Plugin } = require('./esbuild-es5')
const ts = require('typescript')
const path = require('node:path')

const jsOnly = !!process.env.JS_ONLY
const skipJS = !!(process.env.SKIP_JS || false)
const shouldSkipTypes = !!(
  process.argv.includes('--skip-types') || process.env.SKIP_TYPES
)

const shouldSkipNative = !!process.argv.includes('--skip-native')
const shouldSkipMJS = !!process.argv.includes('--skip-mjs')
const shouldBundleFlag = !!process.argv.includes('--bundle')
const shouldBundleNodeModules = !!process.argv.includes('--bundle-modules')
const shouldClean = !!process.argv.includes('clean')
const shouldCleanBuildOnly = !!process.argv.includes('clean:build')
const shouldWatch = process.argv.includes('--watch')
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
const bundleNative = pkg.tamagui?.['bundle.native']
const bundleNativeTest = pkg.tamagui?.['bundle.native.test']
const pkgModule = pkg.module
const pkgModuleJSX = pkg['module:jsx']
const pkgTypes = Boolean(pkg.types || pkg.typings)
const pkgRemoveSideEffects = pkg.removeSideEffects || false

const flatOut = [pkgMain, pkgModule, pkgModuleJSX].filter(Boolean).length === 1

const avoidCJS = pkgMain?.endsWith('.js')

const replaceRNWeb = {
  esm: {
    from: 'from "react-native"',
    to: 'from "react-native-web"',
  },
  cjs: {
    from: 'require("react-native")',
    to: 'require("react-native-web")',
  },
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

    // do one js build but not types
    build({
      skipTypes: true,
    })

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
  }
}

async function build({ skipTypes } = {}) {
  if (process.env.DEBUG) console.info('🔹', pkg.name)
  try {
    const start = Date.now()
    await Promise.all([
      //
      skipTypes ? null : buildTsc(),
      buildJs(),
    ])
    console.info('built', pkg.name, 'in', Date.now() - start, 'ms')
  } catch (error) {
    console.error(` ❌ Error building in ${process.cwd()}:\n\n`, error.stack + '\n')
  }
}

async function buildTsc() {
  if (!pkgTypes || jsOnly || shouldSkipTypes) return
  if (shouldSkipInitialTypes) {
    shouldSkipInitialTypes = false
    return
  }

  const targetDir = 'types'
  await FSE.ensureDir(targetDir)

  try {
    const { config, error } = await loadTsConfig()
    if (error) throw error

    const compilerOptions = createCompilerOptions(config.options, targetDir)
    const { program, emitResult, diagnostics } = await compileTypeScript(
      config.fileNames,
      compilerOptions
    )

    reportDiagnostics(diagnostics)

    if (emitResult.emitSkipped) {
      throw new Error('TypeScript compilation failed')
    }
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      console.error(`Network error during compilation for ${pkg.name}:`, err.message)
    } else {
      console.error(`Error during TypeScript compilation for ${pkg.name}:`, err)
    }
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

async function buildJs() {
  if (skipJS) {
    return
  }

  const externalPlugin = createExternalPlugin({
    skipNodeModulesBundle: true,
  })

  const bundlePlugin = {
    name: `external-most-modules`,
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (
          !args.path.startsWith('.') &&
          !args.path.startsWith('/') &&
          !args.path.startsWith('node:')
        ) {
          return { external: /^(esbuild|mdx-bundler)$/.test(args.path) }
        }
      })
    },
  }

  const external = shouldBundleFlag ? ['@swc/*', '*.node'] : undefined

  /** @type { import('esbuild').BuildOptions } */
  const esbuildBundleProps =
    bundleNative || bundleNativeTest
      ? {
          entryPoints: [bundleNative],
          bundle: true,
          plugins: [
            alias({
              '@tamagui/web': require.resolve('@tamagui/web/native'),

              // for test mode we want real react-native
              ...(!bundleNativeTest && {
                'react-native': require.resolve('@tamagui/fake-react-native'),
                'react-native/Libraries/Renderer/shims/ReactFabric': require.resolve(
                  '@tamagui/fake-react-native'
                ),
                'react-native/Libraries/Renderer/shims/ReactNative': require.resolve(
                  '@tamagui/fake-react-native'
                ),
              }),

              'react-native/Libraries/Pressability/Pressability': require.resolve(
                '@tamagui/fake-react-native'
              ),

              'react-native/Libraries/Pressability/usePressability': require.resolve(
                '@tamagui/fake-react-native/idFn'
              ),

              'react-native-safe-area-context': require.resolve(
                '@tamagui/fake-react-native'
              ),
              'react-native-gesture-handler': require.resolve('@tamagui/proxy-worm'),
            }),
          ],
          external: [
            'react',
            'react-dom',
            bundleNativeTest ? 'react-native' : undefined,
          ].filter(Boolean),
          resolveExtensions: [
            '.native.ts',
            '.native.tsx',
            '.native.js',
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
          ],
          minify: !!process.env.MINIFY,
          define: {
            'process.env.TAMAGUI_IS_CORE_NODE': '"1"',
          },
        }
      : {}

  const start = Date.now()

  const allFiles = (await fg(['src/**/*.(m)?[jt]s(x)?', 'src/**/*.css'])).filter(
    (x) => !x.includes('.d.ts') && (exclude ? !x.match(exclude) : true)
  )

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

    // for tests to load native-mode from node
    bundleNative && !shouldSkipNative
      ? esbuildWriteIfChanged(
          {
            ...esbuildBundleProps,
            outfile: `dist/native.js`,
          },
          {
            platform: 'native',
          }
        )
      : null,

    // for tests to load native-mode from node
    bundleNativeTest && !shouldSkipNative
      ? esbuildWriteIfChanged(
          {
            ...esbuildBundleProps,
            outfile: `dist/test.js`,
          },
          {
            platform: 'native',
            env: 'test',
          }
        )
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
      target: isESM ? 'esnext' : 'node16',
      supported: {
        'logical-assignment': false,
      },
      jsx: 'automatic',
      platform: 'node',
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

    return {
      ...opts,

      plugins: [
        ...(opts.plugins || []),

        ...(platform === 'native'
          ? [
              // class isnt supported by hermes
              es5Plugin(),
            ]
          : []),
      ].filter(Boolean),

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
        ...opts.define,
      },
    }
  })()

  const built = await esbuild.build(buildSettings)

  if (!built.outputFiles) {
    return
  }

  const nativeFilesMap = Object.fromEntries(
    built.outputFiles.flatMap((p) => {
      if (p.path.includes('.native.js')) {
        return [[p.path, true]]
      }
      return []
    })
  )

  const cleanupNonMjsFiles = []

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
          }
        }

        let contents = new TextDecoder().decode(file.contents)

        if (platform === 'web') {
          const rnWebReplacer = replaceRNWeb[opts.format]
          if (rnWebReplacer) {
            contents = contents.replaceAll(rnWebReplacer.from, rnWebReplacer.to)
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
                require.resolve('@tamagui/babel-plugin-fully-specified/commonjs'),
              ].filter(Boolean),
            })

        await FSE.writeFile(path.replace(/\.js$/, '.cjs'), result.code)
      })
    )
    return
  }

  if (shouldSkipMJS || !isESM || platform === 'native') {
    return
  }

  await Promise.all(
    outputs.map(async (file) => {
      if (!file) return

      const { path, contents } = file

      if (!path.endsWith('.js')) return

      // for web do mjs, for native keep js since rollup gets confused when you have both
      const mjsOutPath = platform === 'native' ? path : path.replace('.js', '.mjs')

      // if bundling no need to specify as its all internal
      // and babel is bad on huge bundled files
      const result = opts.bundle
        ? { code: contents }
        : transform(contents, {
            filename: mjsOutPath,
            configFile: false,
            sourceMap: true,
            plugins: [
              [
                require.resolve('@tamagui/babel-plugin-fully-specified'),
                {
                  esExtensionDefault: platform === 'native' ? '.native.js' : '.mjs',
                  esExtensions: platform === 'native' ? ['.js'] : ['.mjs'],
                },
              ],
            ].filter(Boolean),
          })

      cleanupNonMjsFiles.push(path)
      cleanupNonMjsFiles.push(path + '.map')

      // output to mjs fully specified
      if (
        await flush(
          mjsOutPath,
          result.code +
            (result.map ? `\n//# sourceMappingURL=${basename(mjsOutPath)}.map\n` : '')
        )
      ) {
        if (result.map) {
          await FSE.writeFile(mjsOutPath + '.map', JSON.stringify(result.map), 'utf8')
        }
      }
    })
  )

  // if we do mjs we should remove js after to avoid bloat
  if (process.env.TAMAGUI_BUILD_REMOVE_ESM_JS_FILES) {
    if (cleanupNonMjsFiles.length) {
      await Promise.all(
        cleanupNonMjsFiles.map(async (file) => {
          await FSE.remove(file)
        })
      )
    }
  }
}
