import { basename, dirname, join } from 'path'

import esbuild from 'esbuild'
import { pathExists, stat, writeFile } from 'fs-extra'

import { resolveWebOrNativeSpecificEntry } from './loadTamagui'

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
  aliases?: Record<string, string>
) {
  const alias = require('@tamagui/core-node').aliasPlugin
  if (process.env.DEBUG?.startsWith('tamagui')) {
    // eslint-disable-next-line no-console
    console.log(`Building`, entryPoints)
  }
  const tsconfig = join(__dirname, '..', '..', 'tamagui.tsconfig.json')

  const resolvedEntryPoints = !resolvePlatformSpecificEntries
    ? entryPoints
    : entryPoints.map(resolveWebOrNativeSpecificEntry)

  const res: esbuild.BuildOptions = {
    bundle: true,
    entryPoints: resolvedEntryPoints,
    format: 'cjs',
    target: 'node18',
    jsx: 'transform',
    jsxFactory: 'react',
    allowOverwrite: true,
    keepNames: true,
    platform: 'node',
    tsconfig,
    loader: {
      '.js': 'jsx',
    },
    logLevel: 'warning',
    plugins: [
      {
        name: 'external',
        setup(build) {
          build.onResolve({ filter: /@tamagui\/core/ }, (args) => {
            return {
              path: '@tamagui/core-node',
              external: true,
            }
          })

          build.onResolve({ filter: /^(react-native|react-native\/.*)$/ }, (args) => {
            return {
              path: 'react-native-web-lite',
              external: true,
            }
          })
        },
      },
      alias({
        ...aliases,
      }),
    ],
    ...options,
  }

  return res
}

export async function bundle(props: Props, aliases?: Record<string, string>) {
  await asyncLock(props)
  return esbuild.build(getESBuildConfig(props, aliases))
}

export function bundleSync(props: Props, aliases?: Record<string, string>) {
  return esbuild.buildSync(getESBuildConfig(props, aliases))
}

// until i do fancier things w plugins:
async function asyncLock(props: Props) {
  const lockFile = join(dirname(props.outfile), basename(props.outfile, '.lock'))
  const lockStat = await stat(lockFile).catch(() => {
    /* ok */
  })
  const lockedMsAgo = !lockStat
    ? Infinity
    : new Date().getTime() - new Date(lockStat.mtime).getTime()
  if (lockedMsAgo < 500) {
    if (process.env.DEBUG?.startsWith('tamagui')) {
      // eslint-disable-next-line no-console
      console.log(`Waiting for existing build`, props.entryPoints)
    }
    let tries = 5
    while (tries--) {
      if (await pathExists(props.outfile)) {
        return
      } else {
        await new Promise((res) => setTimeout(res, 50))
      }
    }
  }
  void writeFile(lockFile, '')
}
