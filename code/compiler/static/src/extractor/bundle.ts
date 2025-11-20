import { basename, dirname, join } from 'node:path'
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

export const esbuildIgnoreFilesRegex = new RegExp(`\.(${dataExtensions.join('|')})$`, 'i')

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

      {
        name: 'external',
        setup(build) {
          build.onResolve({ filter: /@tamagui\/core/ }, (args) => {
            return {
              path: platform === 'native' ? '@tamagui/core/native' : '@tamagui/core',
              external: true,
            }
          })
          build.onResolve({ filter: /react-native\/package.json$/ }, (args) => {
            return {
              path: 'react-native/package.json',
              external: true,
            }
          })
          build.onResolve({ filter: /@tamagui\/web/ }, (args) => {
            return {
              path: platform === 'native' ? '@tamagui/core/native' : '@tamagui/core',
              external: true,
            }
          })

          build.onResolve({ filter: /^(react-native|react-native\/.*)$/ }, (args) => {
            return {
              path: '@tamagui/react-native-web-lite',
              external: true,
            }
          })

          build.onResolve({ filter: /react-native-reanimated/ }, (args) => {
            return {
              path: 'react-native-reanimated',
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
  await asyncLock(props)
  const config = getESBuildConfig(props, platform, aliases)
  return await esbuild.build(config)
}

// until i do fancier things w plugins:
async function asyncLock(props: Props) {
  const lockFile = join(dirname(props.outfile), basename(props.outfile, '.lock'))
  const lockStat = await FS.stat(lockFile).catch(() => {
    /* ok */
  })
  const lockedMsAgo = !lockStat
    ? Number.POSITIVE_INFINITY
    : new Date().getTime() - new Date(lockStat.mtime).getTime()
  if (lockedMsAgo < 500) {
    if (process.env.DEBUG?.startsWith('tamagui')) {
      console.info(`Waiting for existing build`, props.entryPoints)
    }
    let tries = 5
    while (tries--) {
      if (await FS.pathExists(props.outfile)) {
        return
      }
      await new Promise((res) => setTimeout(res, 50))
    }
  }
  void FS.writeFile(lockFile, '')
}
