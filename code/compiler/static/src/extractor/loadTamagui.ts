import { basename, dirname, extname, join, relative, resolve } from 'node:path'
// @ts-ignore why
import { Color, colorLog } from '@tamagui/cli-color'
import type { CLIResolvedOptions, CLIUserOptions, TamaguiOptions } from '@tamagui/types'
import type { TamaguiInternalConfig } from '@tamagui/web'
import esbuild from 'esbuild'
import * as fsExtra from 'fs-extra'

import { SHOULD_DEBUG } from '../constants'
import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import { getNameToPaths, registerRequire } from '../registerRequire'
import {
  type TamaguiProjectInfo,
  getBundledConfig,
  getLoadedConfig,
  hasBundledConfigChanged,
  loadComponents,
  writeTamaguiCSS,
} from './bundleConfig'
import { getTamaguiConfigPathFromOptionsConfig } from './getTamaguiConfigPathFromOptionsConfig'
import {
  generateTamaguiThemes,
  regenerateConfig,
  regenerateConfigSync,
} from './regenerateConfig'

const getFilledOptions = (propsIn: Partial<TamaguiOptions>): TamaguiOptions => ({
  // defaults
  platform: (process.env.TAMAGUI_TARGET as any) || 'web',
  config: 'tamagui.config.ts',
  components: ['tamagui'],
  ...(propsIn as Partial<TamaguiOptions>),
})

let isLoadingPromise: null | Promise<any>

export async function loadTamagui(
  propsIn: Partial<TamaguiOptions>
): Promise<TamaguiProjectInfo | null> {
  if (isLoadingPromise) return await isLoadingPromise

  let resolvePromise
  let rejectPromise
  isLoadingPromise = new Promise((res, rej) => {
    resolvePromise = res
    rejectPromise = rej
  })

  try {
    const props = getFilledOptions(propsIn)

    const bundleInfo = await getBundledConfig(props)
    if (!bundleInfo) {
      console.warn(
        `No bundled config generated, maybe an error in bundling. Set DEBUG=tamagui and re-run to get logs.`
      )
      resolvePromise(null)
      return null
    }

    // this affects the bundled config so run it first
    await generateThemesAndLog(props)

    if (!hasBundledConfigChanged()) {
      resolvePromise(bundleInfo)
      return bundleInfo
    }

    if (process.env.NODE_ENV === 'development') {
      await regenerateConfig(props, bundleInfo)
    }

    resolvePromise(bundleInfo)
    return bundleInfo
  } catch (err) {
    rejectPromise()
    throw err
  } finally {
    isLoadingPromise = null
  }
}

// debounce a bit
let waiting = false

export const generateThemesAndLog = async (options: TamaguiOptions, force = false) => {
  if (waiting) return
  if (!options.themeBuilder) return
  try {
    waiting = true
    await new Promise((res) => setTimeout(res, 30))
    const didGenerate = await generateTamaguiThemes(options, force)

    // only logs when changed
    if (didGenerate) {
      const whitespaceBefore = `    `
      colorLog(
        Color.FgYellow,
        `${whitespaceBefore}➡ [tamagui] generated themes: ${relative(
          process.cwd(),
          options.themeBuilder.output
        )}`
      )

      if (options.outputCSS) {
        const loadedConfig = getLoadedConfig()
        if (loadedConfig) {
          await writeTamaguiCSS(options.outputCSS, loadedConfig)
        }
      }
    }
  } finally {
    waiting = false
  }
}

const last: Record<string, TamaguiProjectInfo | null> = {}
const lastVersion: Record<string, string> = {}

export function loadTamaguiBuildConfigSync(
  tamaguiOptions: Partial<TamaguiOptions> | undefined
) {
  const buildFilePath = tamaguiOptions?.buildFile ?? 'tamagui.build.ts'
  if (fsExtra.existsSync(buildFilePath)) {
    const registered = registerRequire('web')
    try {
      const out = require(buildFilePath).default
      if (!out) {
        throw new Error(`No default export found in ${buildFilePath}: ${out}`)
      }
      tamaguiOptions = {
        ...tamaguiOptions,
        ...out,
      }
    } finally {
      registered.unregister()
    }
  }
  if (!tamaguiOptions) {
    throw new Error(
      `No tamagui build options found either via input props or at tamagui.build.ts`
    )
  }
  return {
    config: 'tamagui.config.ts',
    components: ['@tamagui/core'],
    ...tamaguiOptions,
  } as TamaguiOptions
}

// loads in-process using esbuild-register
export function loadTamaguiSync({
  forceExports,
  cacheKey,
  ...propsIn
}: Partial<TamaguiOptions> & {
  forceExports?: boolean
  cacheKey?: string
}): TamaguiProjectInfo {
  const key = JSON.stringify(propsIn)

  if (last[key] && !hasBundledConfigChanged()) {
    if (!lastVersion[key] || lastVersion[key] === cacheKey) {
      return last[key]!
    }
  }

  lastVersion[key] = cacheKey || ''

  const props = getFilledOptions(propsIn)

  // lets shim require and avoid importing react-native + react-native-web
  // we just need to read the config around them
  process.env.IS_STATIC = 'is_static'
  process.env.TAMAGUI_IS_SERVER = 'true'

  const { unregister } = registerRequire(props.platform || 'web', {
    proxyWormImports: !!forceExports,
  })

  try {
    const devValueOG = globalThis['__DEV__' as any]
    globalThis['__DEV__' as any] = process.env.NODE_ENV === 'development'

    try {
      // config
      let tamaguiConfig: TamaguiInternalConfig | null = null
      if (propsIn.config) {
        const configPath = getTamaguiConfigPathFromOptionsConfig(propsIn.config)
        const exp = require(configPath)

        if (!exp || exp._isProxyWorm) {
          throw new Error(`Got a empty / proxied config!`)
        }

        tamaguiConfig = (exp['default'] || exp['config'] || exp) as TamaguiInternalConfig

        if (!tamaguiConfig || !tamaguiConfig.parsed) {
          const confPath = require.resolve(configPath)
          throw new Error(`Can't find valid config in ${confPath}:
          
  Be sure you "export default" or "export const config" the config.`)
        }

        // set up core
        if (tamaguiConfig) {
          const { createTamagui } = requireTamaguiCore(props.platform || 'web')
          createTamagui(tamaguiConfig as any)
        }
      }

      // components
      const components = loadComponents(props, forceExports)
      if (!components) {
        throw new Error(`No components loaded`)
      }
      if (process.env.DEBUG === 'tamagui') {
        console.info(`components`, components)
      }

      // undo shims
      process.env.IS_STATIC = undefined
      globalThis['__DEV__' as any] = devValueOG

      const info = {
        components,
        tamaguiConfig,
        nameToPaths: getNameToPaths(),
      } satisfies TamaguiProjectInfo

      if (tamaguiConfig) {
        const { outputCSS } = props
        if (outputCSS) {
          writeTamaguiCSS(outputCSS, tamaguiConfig)
        }

        regenerateConfigSync(props, info)
      }

      last[key] = {
        ...info,
        cached: true,
      }

      return info as any
    } catch (err) {
      if (err instanceof Error) {
        if (!SHOULD_DEBUG && !forceExports) {
          console.warn(
            `Error loading tamagui.config.ts (set DEBUG=tamagui to see full stack), running tamagui without custom config`
          )
          console.info(`\n\n    ${err.message}\n\n`)
        } else {
          if (SHOULD_DEBUG) {
            console.error(err)
          }
        }
      } else {
        console.error(`Error loading tamagui.config.ts`, err)
      }

      const { createTamagui } = requireTamaguiCore(props.platform || 'web')
      const { getDefaultTamaguiConfig } = require('@tamagui/config-default')

      return {
        components: [],
        tamaguiConfig: createTamagui(getDefaultTamaguiConfig()) as any,
        nameToPaths: {},
      }
    }
  } finally {
    unregister()
  }
}

export async function getOptions({
  root = process.cwd(),
  tsconfigPath = 'tsconfig.json',
  tamaguiOptions,
  host,
  debug,
}: Partial<CLIUserOptions> = {}): Promise<CLIResolvedOptions> {
  const dotDir = join(root, '.tamagui')
  let pkgJson = {}

  try {
    pkgJson = await fsExtra.readJSON(join(root, 'package.json'))
  } catch (err) {
    // ok
  }

  return {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    root,
    host: host || '127.0.0.1',
    pkgJson,
    debug,
    tsconfigPath,
    tamaguiOptions: {
      platform: (process.env.TAMAGUI_TARGET as any) || 'web',
      components: ['tamagui'],
      ...tamaguiOptions,
      config:
        tamaguiOptions?.config ??
        (await getDefaultTamaguiConfigPath(root, tamaguiOptions?.config)),
    },
    paths: {
      root,
      dotDir,
      conf: join(dotDir, 'tamagui.config.json'),
      types: join(dotDir, 'types.json'),
    },
  }
}

export function resolveWebOrNativeSpecificEntry(entry: string) {
  const workspaceRoot = resolve()
  const resolved = require.resolve(entry, { paths: [workspaceRoot] })
  const ext = extname(resolved)
  const fileName = basename(resolved).replace(ext, '')
  const specificExt = process.env.TAMAGUI_TARGET === 'web' ? 'web' : 'native'
  const specificFile = join(dirname(resolved), fileName + '.' + specificExt + ext)
  if (fsExtra.existsSync(specificFile)) {
    return specificFile
  }
  return entry
}

const defaultPaths = ['tamagui.config.ts', join('src', 'tamagui.config.ts')]
let hasWarnedOnce = false

async function getDefaultTamaguiConfigPath(root: string, configPath?: string) {
  const searchPaths = [
    ...new Set(
      [configPath, ...defaultPaths].filter(Boolean).map((p) => join(root, p as string))
    ),
  ]

  for (const path of searchPaths) {
    if (await fsExtra.pathExists(path)) {
      return path
    }
  }

  if (!hasWarnedOnce) {
    hasWarnedOnce = true
    console.warn(`Warning: couldn't find tamagui.config.ts in the following paths given configuration "${configPath}":
    ${searchPaths.join(`\n  `)}
  `)
  }
}

export type { TamaguiProjectInfo }

export async function esbuildWatchFiles(entry: string, onChanged: () => void) {
  let hasRunOnce = false

  /**
   * We're just (ab)using this as a file watcher, so bundle = true to follow paths
   * and then write: false and logLevel silent to avoid all errors
   */

  const context = await esbuild.context({
    bundle: true,
    entryPoints: [entry],
    resolveExtensions: ['.ts', '.tsx', '.js', '.mjs'],
    logLevel: 'silent',
    write: false,

    alias: {
      '@react-native/normalize-color': '@tamagui/proxy-worm',
      'react-native-web': '@tamagui/react-native-web-lite',
      'react-native': '@tamagui/proxy-worm',
    },

    plugins: [
      // to log what its watching:
      // {
      //   name: 'test',
      //   setup({ onResolve }) {
      //     onResolve({ filter: /.*/ }, (args) => {
      //       console.log('wtf', args.path)
      //     })
      //   },
      // },

      {
        name: `on-rebuild`,
        setup({ onEnd, onResolve }) {
          // external node modules
          let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
          onResolve({ filter }, (args) => ({ path: args.path, external: true }))

          onEnd(() => {
            if (!hasRunOnce) {
              hasRunOnce = true
            } else {
              onChanged()
            }
          })
        },
      },
    ],
  })

  // just returns after dispose is called i think
  void context.watch()

  return () => {
    context.dispose()
  }
}
