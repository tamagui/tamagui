import { readFileSync } from 'node:fs'
import esbuild from 'esbuild'
import * as FS from 'fs-extra'
import type { TamaguiPlatform } from '../types'
import { detectModuleFormat } from './detectModuleFormat'
import { esbuildAliasPlugin } from './esbuildAliasPlugin'
import { hasTopLevelAwait } from './hasTopLevelAwait'
import { resolveWebOrNativeSpecificEntry } from './loadTamagui'
import { TsconfigPathsPlugin } from './esbuildTsconfigPaths'

export const esbuildLoaderConfig = {
  '.js': 'jsx',
  '.png': 'dataurl',
  '.jpg': 'dataurl',
  '.jpeg': 'dataurl',
  '.svg': 'dataurl',
  '.gif': 'dataurl',
  '.webp': 'dataurl',
  '.woff2': 'dataurl',
  '.woff': 'dataurl',
  '.eot': 'dataurl',
  '.otf': 'dataurl',
  '.ttf': 'dataurl',
  '.mp4': 'file',
  '.mpeg4': 'file',
  '.mov': 'file',
  '.avif': 'file',
  '.wmv': 'file',
  '.webm': 'file',
  '.wav': 'file',
  '.aac': 'file',
  '.ogg': 'file',
  '.flac': 'file',
  '.node': 'empty',
} as const

const dataExtensions = Object.keys(esbuildLoaderConfig)
  .filter(
    (k) => esbuildLoaderConfig[k] === 'file' || esbuildLoaderConfig[k] === 'dataurl'
  )
  .map((k) => k.slice(1))

export const esbuildIgnoreFilesRegex = new RegExp(`.(${dataExtensions.join('|')})$`, 'i')

/**
 * For internal loading of new files
 */

type Props = Omit<Partial<esbuild.BuildOptions>, 'entryPoints'> & {
  outfile: string
  entryPoints: string[]
  resolvePlatformSpecificEntries?: boolean
}

function getESBuildConfig(
  {
    entryPoints,
    resolvePlatformSpecificEntries,
    define: callerDefine,
    ...options
  }: Props,
  platform: TamaguiPlatform,
  aliases?: Record<string, string>
) {
  if (process.env.DEBUG?.startsWith('tamagui')) {
    console.info(`Building`, entryPoints)
  }

  const resolvedEntryPoints = !resolvePlatformSpecificEntries
    ? entryPoints
    : entryPoints.map((entry) => resolveWebOrNativeSpecificEntry(entry, platform))

  // detect format from entry points if not explicitly provided by caller
  const detectedFormat = options.format || detectEntryFormat(resolvedEntryPoints[0])

  // inline platform env vars for the bundled config + components.
  // the bundled output runs in node afterward (CSS extraction time), at which
  // point process.env reflects whatever the build tool's parent process had —
  // not necessarily the platform we're bundling for. inlining via esbuild's
  // define makes the bundle self-consistent regardless of host env, which
  // matters most for vite/vxrn (which doesn't set TAMAGUI_TARGET globally
  // because the same plugin handles native too) and for any code in the bundle
  // graph that reads EXPO_OS (expo-modules-core's Platform.OS, etc.).
  const platformDefines: Record<string, string> =
    platform === 'web'
      ? {
          'process.env.TAMAGUI_TARGET': '"web"',
          'process.env.EXPO_OS': '"web"',
        }
      : {
          'process.env.TAMAGUI_TARGET': '"native"',
          // EXPO_OS doesn't have a useful "native" value (it's ios/android),
          // so leave it alone here and let the consumer set it if needed.
        }

  const res: esbuild.BuildOptions = {
    bundle: true,
    entryPoints: resolvedEntryPoints,
    format: detectedFormat,
    define: {
      ...platformDefines,
      ...(callerDefine || {}),
    },
    // for ESM: prefer "module" field for resolution, add require() shim for bundled CJS deps
    ...(detectedFormat === 'esm'
      ? {
          mainFields: ['module', 'main'],
          banner: {
            js: 'import { createRequire as __cr } from "module"; const require = __cr(import.meta.url);',
          },
        }
      : {}),
    target: 'node24',
    jsx: 'transform',
    jsxFactory: 'react',
    allowOverwrite: true,
    keepNames: true,
    resolveExtensions: [
      ...(platform === 'web'
        ? ['.web.tsx', '.web.ts', '.web.jsx', '.web.js']
        : ['.native.tsx', '.native.ts', '.native.jsx', '.native.js']),
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
    platform: 'node',
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
      },
    },
    loader: esbuildLoaderConfig,
    logLevel: 'warning',
    plugins: [
      TsconfigPathsPlugin(),

      // handle ESM-only features that can't be used with CJS output
      {
        name: 'handle-esm-features',
        setup(build) {
          // only apply transforms for CJS output - ESM supports these natively
          const isCjs =
            build.initialOptions.format === 'cjs' || !build.initialOptions.format

          build.onLoad({ filter: /\.(ts|tsx|js|jsx|mjs)$/ }, (args) => {
            // skip if ESM output - import.meta and top-level await work natively
            if (!isCjs) {
              return null
            }

            // skip most node_modules
            if (args.path.includes('node_modules') && !args.path.includes('@tamagui')) {
              return null
            }

            let contents = readFileSync(args.path, 'utf8')
            let modified = false

            // transform import.meta.env -> process.env (Vite-style env vars)
            if (contents.includes('import.meta.env')) {
              contents = contents.replace(/import\.meta\.env/g, 'process.env')
              modified = true
            }

            // transform import.meta.url -> "" (not needed for static extraction)
            if (contents.includes('import.meta.url')) {
              contents = contents.replace(/import\.meta\.url/g, '""')
              modified = true
            }

            // transform import.meta.main -> false
            if (contents.includes('import.meta.main')) {
              contents = contents.replace(/import\.meta\.main/g, 'false')
              modified = true
            }

            // stub files with top-level await - they're typically runtime-only
            if (hasTopLevelAwait(contents, args.path)) {
              if (process.env.DEBUG?.startsWith('tamagui')) {
                console.info(`[tamagui] stubbing file with top-level await: ${args.path}`)
              }
              return {
                // Keep this as an ESM-shaped stub so esbuild doesn't inline a
                // top-level `module.exports = {}` into the parent bundle.
                contents: `// stubbed - contains top-level await\nexport default {}`,
                loader: 'js',
              }
            }

            if (modified) {
              return {
                contents,
                loader: args.path.endsWith('.tsx')
                  ? 'tsx'
                  : args.path.endsWith('.ts')
                    ? 'ts'
                    : args.path.endsWith('.jsx')
                      ? 'jsx'
                      : 'js',
              }
            }

            return null
          })
        },
      },

      {
        name: 'external',
        setup(build) {
          const proxyWormPath = require.resolve('@tamagui/proxy-worm')

          // only externalize @tamagui/core and @tamagui/web - these are provided at runtime
          // other @tamagui/* packages (like @tamagui/config/v3) must be bundled in to avoid
          // ESM race conditions when multiple threads require() them concurrently
          build.onResolve({ filter: /^@tamagui\/(core|web)$/ }, (args) => {
            if (args.kind === 'entry-point') {
              return null
            }
            return {
              path: platform === 'native' ? '@tamagui/core/native' : args.path,
              external: true,
            }
          })

          build.onResolve({ filter: /react-native\/package.json$/ }, () => {
            return {
              path: 'react-native/package.json',
              external: true,
            }
          })

          build.onResolve({ filter: /^(react-native|react-native\/.*)$/ }, () => {
            return {
              path: '@tamagui/react-native-web-lite',
              external: true,
            }
          })

          build.onResolve({ filter: /^react-native-reanimated(?:\/.*)?$/ }, () => {
            return {
              path: proxyWormPath,
            }
          })

          build.onResolve({ filter: /^react-native-worklets(?:\/.*)?$/ }, () => {
            return {
              path: proxyWormPath,
            }
          })

          // externalize animation libraries - not needed for static extraction
          build.onResolve({ filter: /^(framer-motion|motion)/ }, (args) => {
            return {
              path: args.path,
              external: true,
            }
          })
        },
      },
      esbuildAliasPlugin({
        ...aliases,
      }),
    ],
    ...options,
  }

  return res
}

function detectEntryFormat(entryPoint: string): esbuild.BuildOptions['format'] {
  // file path - detect from file/package.json
  if (entryPoint.startsWith('/') || entryPoint.startsWith('.')) {
    return detectModuleFormat(entryPoint)
  }
  // bare module specifier - check package.json type field
  try {
    const pkgJsonPath = require.resolve(entryPoint + '/package.json')
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))
    return pkg.type === 'module' ? 'esm' : 'cjs'
  } catch {
    return 'cjs'
  }
}

export async function esbundleTamaguiConfig(
  props: Props,
  platform: TamaguiPlatform,
  aliases?: Record<string, string>
) {
  const config = getESBuildConfig(props, platform, aliases)

  // build to memory first, then write atomically (temp file + rename)
  // to prevent other threads from reading partially-written files
  const tmpFile = props.outfile + '.tmp.' + process.pid
  const result = await esbuild.build({
    ...config,
    outfile: tmpFile,
  })

  // atomic rename prevents other threads from reading partial files
  await FS.rename(tmpFile, props.outfile)

  return result
}
