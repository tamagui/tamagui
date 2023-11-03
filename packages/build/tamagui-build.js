#!/usr/bin/env node
/* eslint-disable no-console */

const exec = require('execa')
const fs = require('fs-extra')
const esbuild = require('esbuild')
const fg = require('fast-glob')
const createExternalPlugin = require('./externalNodePlugin')
const debounce = require('lodash.debounce')
const { dirname } = require('path')
const alias = require('./esbuildAliasPlugin')

const jsOnly = !!process.env.JS_ONLY
const skipJS = !!(process.env.SKIP_JS || false)
const shouldSkipTypes = !!(
  process.argv.includes('--skip-types') || process.env.SKIP_TYPES
)
const shouldBundle = !!process.argv.includes('--bundle')
const shouldBundleNodeModules = !!process.argv.includes('--bundle-modules')
const shouldClean = !!process.argv.includes('clean')
const shouldCleanBuildOnly = !!process.argv.includes('clean:build')
const shouldWatch = process.argv.includes('--watch')
const declarationToRoot = !!process.argv.includes('--declaration-root')
const ignoreBaseUrl = process.argv.includes('--ignore-base-url')
const baseUrlIndex = process.argv.indexOf('--base-url')
const tsProjectIndex = process.argv.indexOf('--ts-project')
const baseUrl =
  baseUrlIndex > -1 && process.argv[baseUrlIndex + 1]
    ? process.argv[baseUrlIndex + 1]
    : '.'
const tsProject =
  tsProjectIndex > -1 && process.argv[tsProjectIndex + 1]
    ? process.argv[tsProjectIndex + 1]
    : null

const pkg = fs.readJSONSync('./package.json')
let shouldSkipInitialTypes = !!process.env.SKIP_TYPES_INITIAL
const pkgMain = pkg.main
const pkgSource = pkg.source
const bundleNative = pkg.tamagui?.['bundle.native']
const bundleNativeTest = pkg.tamagui?.['bundle.native.test']
const pkgModule = pkg.module
const pkgModuleJSX = pkg['module:jsx']
const pkgTypes = Boolean(pkg['types'] || pkg['typings'])

const flatOut = [pkgMain, pkgModule, pkgModuleJSX].filter(Boolean).length === 1

const replaceRNWeb = {
  esm: {
    from: 'from "react-native"',
    to: 'from "react-native-web"'
  },
  cjs: {
    from: 'require("react-native")',
    to: 'require("react-native-web")'
  }
}

async function clean() {
  try {
    await Promise.allSettled([
      //
      fs.remove('.turbo'),
      fs.remove('node_modules'),
      fs.remove('.ultra.cache.json'),
      fs.remove('types'),
      fs.remove('dist'),
    ])
  } catch {
    // ok
  }
  if (shouldCleanBuildOnly) {
    console.info('🔹 cleaned', pkg.name)
    process.exit(0)
  }
  try {
    await Promise.allSettled([fs.remove('node_modules')])
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
  return
}

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
  return
}

build()

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
  if (!pkgTypes) return
  if (jsOnly || shouldSkipTypes) return
  if (shouldSkipInitialTypes) {
    shouldSkipInitialTypes = false
    return
  }

  const targetDir = 'types'
  try {
    // typescripts build cache messes up when doing declarationOnly
    await fs.remove('tsconfig.tsbuildinfo')
    await fs.ensureDir(targetDir)

    const declarationToRootFlag = declarationToRoot ? ' --declarationDir ./' : ''
    const baseUrlFlag = ignoreBaseUrl ? '' : ` --baseUrl ${baseUrl}`
    const tsProjectFlag = tsProject ? ` --project ${tsProject}` : ''
    const cmd = `tsc${baseUrlFlag}${tsProjectFlag} --outDir ${targetDir} --rootDir src ${declarationToRootFlag}--emitDeclarationOnly --declarationMap`

    console.info('\x1b[2m$', `npx ${cmd}`)
    await exec('npx', cmd.split(' '))
  } catch (err) {
    console.info(err.message)
    if (!shouldWatch) {
      process.exit(1)
    }
  } finally {
    await fs.remove('tsconfig.tsbuildinfo')
  }
}

async function buildJs() {
  if (skipJS) {
    return
  }

  let files = shouldBundle
    ? [pkgSource || './src/index.ts']
    : (await fg(['src/**/*.(m)?[jt]s(x)?', 'src/**/*.css'])).filter(
        (x) => !x.includes('.d.ts')
      )

  const externalPlugin = createExternalPlugin({
    skipNodeModulesBundle: true,
  })

  const external = shouldBundle ? ['@swc/*', '*.node'] : undefined

  /** @type { import('esbuild').BuildOptions } */
  const esbuildBundleProps =
    bundleNative || bundleNativeTest
      ? {
          entryPoints: [bundleNative],
          bundle: true,
          target: 'node16',
          format: 'cjs',
          jsx: 'automatic',
          platform: 'node',
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
          minify: process.env.MINIFY ? true : false,
          define: {
            'process.env.TAMAGUI_IS_CORE_NODE': '"1"',
          },
        }
      : {}

  const start = Date.now()

  const cjsConfig = {
    entryPoints: files,
    outdir: flatOut ? 'dist' : 'dist/cjs',
    bundle: shouldBundle,
    external,
    target: 'node16',
    format: 'cjs',
    jsx: 'automatic',
    plugins: shouldBundleNodeModules ? [] : [externalPlugin],
    minify: process.env.MINIFY ? true : false,
    platform: 'node',
  }

  const esmConfig = {
    entryPoints: files,
    outdir: flatOut ? 'dist' : 'dist/esm',
    bundle: shouldBundle,
    external,
    target: 'esnext',
    jsx: 'automatic',
    allowOverwrite: true,
    format: 'esm',
    minify: process.env.MINIFY ? true : false,
    platform: shouldBundle ? 'node' : 'neutral',
  }

  return await Promise.all([
    // web output to cjs
    pkgMain
      ? esbuildWriteIfChanged(cjsConfig, {
          platform: 'web',
        })
      : null,

    // native output to cjs
    pkgMain
      ? esbuildWriteIfChanged(cjsConfig, {
          platform: 'native',
        })
      : null,

    // for tests to load native-mode from node
    bundleNative
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
    bundleNativeTest
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
        })
      : null,

    // web output to esm
    pkgModule
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
            entryPoints: files,
            bundle: shouldBundle,
            allowOverwrite: true,
            target: 'esnext',
            format: 'esm',
            minify: process.env.MINIFY ? true : false,
            platform: 'neutral',
          },
          {
            platform: 'web',
          }
        )
      : null,

    // jsx native
    pkgModuleJSX
      ? esbuildWriteIfChanged(
          {
            // only diff is jsx preserve and outdir
            jsx: 'preserve',
            outdir: flatOut ? 'dist' : 'dist/jsx',
            entryPoints: files,
            bundle: shouldBundle,
            allowOverwrite: true,
            target: 'node16',
            format: 'esm',
            minify: process.env.MINIFY ? true : false,
            platform: 'neutral',
          },
          {
            platform: 'native',
          }
        )
      : null,
  ]).then(() => {
    if (process.env.DEBUG) console.info(`built js in ${Date.now() - start}ms`)
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
  { platform, env } = {
    platform: '',
    env: '',
  }
) {
  if (!shouldWatch && !platform) {
    return await esbuild.build(opts)
  }
  
  const built = await esbuild.build({
    ...opts,

    plugins: [
      ...(opts.plugins || []),

      // not workin
      // {
      //   name: 'no-side-effects',
      //   setup(build) {
      //     build.onResolve({ filter: /@tamagui.*/ }, async ({ path, ...options }) => {
      //       const result = await build.resolve(path, {
      //         ...options,
      //         namespace: 'noRecurse',
      //       })
      //       console.log('no side effects', path)
      //       return { ...result, sideEffects: false }
      //     })
      //   },
      // },
    ].filter(Boolean),

    treeShaking: true,
    minifySyntax: true,
    // minifyIdentifiers: true,
    write: false,
    color: true,
    allowOverwrite: true,
    keepNames: false,
    sourcemap: true,
    sourcesContent: false,
    logLevel: 'error',

    ...(platform === 'web' && {
      tsconfigRaw: {
        compilerOptions: {
          paths: {
            'react-native': ['react-native-web'],
          },
        },
      },
    }),

    define: {
      ...(platform && {
        'process.env.TAMAGUI_TARGET': `"${platform}"`,
      }),
      ...(env && {
        'process.env.NODE_ENV': `"${env}"`,
      }),
      ...opts.define,
    },
  })

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

  await Promise.all(
    built.outputFiles.map(async (file) => {
      let outPath = file.path

      if (outPath.endsWith('.js') || outPath.endsWith('.js.map')) {
        const [_, extPlatform] =
          outPath.match(/(web|native|ios|android)\.js(\.map)?$/) ?? []

        if (platform === 'native') {
          if (!extPlatform && nativeFilesMap[outPath.replace('.js', '.native.js')]) {
            // if native exists, avoid outputting non-native
            return
          }

          if (extPlatform === 'web') {
            return
          }
          if (!extPlatform) {
            outPath = outPath.replace('.js', '.native.js')
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

      const outDir = dirname(outPath)

      await fs.ensureDir(outDir)
      let outString = new TextDecoder().decode(file.contents)

      if (platform === 'web') {
        const rnWebReplacer = replaceRNWeb[opts.format]
        if (rnWebReplacer) {
          outString = outString.replaceAll(rnWebReplacer.from, rnWebReplacer.to)
        }
      }

      if (shouldWatch) {
        if (
          !(await fs.pathExists(outPath)) ||
          (await fs.readFile(outPath, 'utf8')) !== outString
        ) {
          await fs.writeFile(outPath, outString)
        }
      } else {
        await fs.writeFile(outPath, outString)
      }
    })
  )
}
