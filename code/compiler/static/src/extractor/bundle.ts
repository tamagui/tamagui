import esbuild from 'esbuild'
import * as FS from 'fs-extra'
import type { TamaguiPlatform } from '../types'
import { esbuildAliasPlugin } from './esbuildAliasPlugin'
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
  { entryPoints, resolvePlatformSpecificEntries, ...options }: Props,
  platform: TamaguiPlatform,
  aliases?: Record<string, string>
) {
  if (process.env.DEBUG?.startsWith('tamagui')) {
    console.info(`Building`, entryPoints)
  }

  const resolvedEntryPoints = !resolvePlatformSpecificEntries
    ? entryPoints
    : entryPoints.map(resolveWebOrNativeSpecificEntry)

  const res: esbuild.BuildOptions = {
    bundle: true,
    entryPoints: resolvedEntryPoints,
    format: 'cjs',
    target: 'node20',
    jsx: 'transform',
    jsxFactory: 'react',
    allowOverwrite: true,
    keepNames: true,
    // handle import.meta.env.* -> process.env.* for Vite-style env vars
    define: {
      'import.meta.env': 'process.env',
      'import.meta.url': '""',
      'import.meta.main': 'false',
    },
    resolveExtensions: [
      ...(process.env.TAMAGUI_TARGET === 'web'
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

      // stub out files with top-level await - they're typically runtime-only
      // and not needed for static extraction
      {
        name: 'handle-top-level-await',
        setup(build) {
          build.onLoad({ filter: /\.(ts|tsx|js|jsx|mjs)$/ }, async (args) => {
            // skip node_modules except for specific cases
            if (args.path.includes('node_modules') && !args.path.includes('@tamagui')) {
              return null
            }

            const fs = await import('node:fs')
            const contents = await fs.promises.readFile(args.path, 'utf8')

            // detect top-level await - look for await outside of async function/arrow
            // this is a simplified check that looks for common patterns
            if (/^\s*(?:const|let|var|export)\s+[^=]*=\s*await\b/m.test(contents) ||
                /^await\s/m.test(contents)) {
              if (process.env.DEBUG?.startsWith('tamagui')) {
                console.info(`[tamagui] stubbing file with top-level await: ${args.path}`)
              }
              return {
                contents: `// stubbed - contains top-level await\nmodule.exports = {}`,
                loader: 'js',
              }
            }

            return null
          })
        },
      },

      {
        name: 'external',
        setup(build) {
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

          build.onResolve({ filter: /react-native-reanimated/ }, () => {
            return {
              path: 'react-native-reanimated',
              external: true,
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
