import { basename, dirname, extname, join, resolve } from 'path'

import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import { createTamagui } from '@tamagui/core-node'
import { CLIResolvedOptions, CLIUserOptions } from '@tamagui/types'
import type { TamaguiInternalConfig } from '@tamagui/web'
import esbuild from 'esbuild'
import fs, { existsSync, pathExists, readJSON } from 'fs-extra'

import { SHOULD_DEBUG } from '../constants.js'
import { getNameToPaths, registerRequire, unregisterRequire } from '../require.js'
import { TamaguiOptions } from '../types.js'
import {
  Props,
  TamaguiProjectInfo,
  bundleConfig,
  esbuildOptions,
  loadComponents,
} from './bundleConfig.js'
import { generateTamaguiConfig } from './generateTamaguiConfig.js'

const cache = {}

export async function loadTamagui(props: Props): Promise<TamaguiProjectInfo> {
  const key = JSON.stringify(props)
  if (cache[key]) {
    if (cache[key] instanceof Promise) {
      return await cache[key]
    }
    return cache[key]
  }

  let resolver: Function = () => {}
  cache[key] = new Promise((res) => {
    resolver = res
  })

  try {
    registerRequire()
    const bundleInfo = await bundleConfig(props)

    cache[key] = bundleInfo

    // init core-node
    createTamagui(cache[key].tamaguiConfig)

    resolver(cache[key])

    return cache[key]
  } finally {
    unregisterRequire()
  }
}

export function resolveWebOrNativeSpecificEntry(entry: string) {
  const workspaceRoot = resolve()
  const resolved = require.resolve(entry, { paths: [workspaceRoot] })
  const ext = extname(resolved)
  const fileName = basename(resolved).replace(ext, '')
  const specificExt = process.env.TAMAGUI_TARGET === 'web' ? 'web' : 'native'
  const specificFile = join(dirname(resolved), fileName + '.' + specificExt + ext)
  if (existsSync(specificFile)) {
    return specificFile
  }
  return entry
}

// loads in-process using esbuild-register
export function loadTamaguiSync(props: Props): TamaguiProjectInfo {
  const key = JSON.stringify(props)
  if (cache[key]) {
    return cache[key]
  }

  const { unregister } = require('esbuild-register/dist/node').register(esbuildOptions)

  try {
    registerRequire()

    // lets shim require and avoid importing react-native + react-native-web
    // we just need to read the config around them
    process.env.IS_STATIC = 'is_static'
    const devValueOG = globalThis['__DEV__' as any]
    globalThis['__DEV__' as any] = process.env.NODE_ENV === 'development'

    try {
      // config
      let tamaguiConfig: TamaguiInternalConfig | null = null
      if (props.config) {
        const configPath = join(process.cwd(), props.config)
        const exp = require(configPath)
        tamaguiConfig = (exp['default'] || exp) as TamaguiInternalConfig
        if (!tamaguiConfig || !tamaguiConfig.parsed) {
          const confPath = require.resolve(configPath)
          throw new Error(`Can't find valid config in ${confPath}:
          
  Be sure you "export default" the config.`)
        }
      }

      // components
      const components = loadComponents(props)
      if (!components) {
        throw new Error(`No components loaded`)
      }
      if (process.env.DEBUG === 'tamagui') {
        console.log(`components`, components)
      }

      // undo shims
      process.env.IS_STATIC = undefined
      globalThis['__DEV__' as any] = devValueOG

      // set up core-node
      if (props.config && tamaguiConfig) {
        createTamagui(tamaguiConfig as any)
      }

      cache[key] = {
        components,
        tamaguiConfig,
        nameToPaths: getNameToPaths(),
      }
    } catch (err) {
      if (err instanceof Error) {
        console.warn(
          `Error loading tamagui.config.ts (set DEBUG=tamagui to see full stack), running tamagui without custom config`
        )
        console.log(`\n\n    ${err.message}\n\n`)
        if (SHOULD_DEBUG) {
          console.log(err.stack)
        }
      } else {
        console.error(`Error loading tamagui.config.ts`, err)
      }
      return {
        components: [],
        tamaguiConfig: getDefaultTamaguiConfig(),
        nameToPaths: {},
      }
    }

    return cache[key]
  } finally {
    unregister()
    unregisterRequire()
  }
}

export async function getOptions({
  root = process.cwd(),
  tsconfigPath = 'tsconfig.json',
  tamaguiOptions,
  host,
  debug,
}: Partial<CLIUserOptions> = {}): Promise<CLIResolvedOptions> {
  const tsConfigFilePath = join(root, tsconfigPath)
  if (!(await fs.pathExists(tsConfigFilePath)))
    throw new Error(`No tsconfig found: ${tsConfigFilePath}`)
  const dotDir = join(root, '.tamagui')
  const pkgJson = await readJSON(join(root, 'package.json'))

  return {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    root,
    host: host || '127.0.0.1',
    pkgJson,
    debug,
    tsconfigPath,
    tamaguiOptions: {
      components: ['tamagui'],
      config: await getDefaultTamaguiConfigPath(),
      ...tamaguiOptions,
    },
    paths: {
      dotDir,
      conf: join(dotDir, 'tamagui.config.json'),
      types: join(dotDir, 'types.json'),
    },
  }
}

export async function watchTamaguiConfig(tamaguiOptions: TamaguiOptions) {
  const options = await getOptions({ tamaguiOptions })

  if (!options.tamaguiOptions.config) return

  await generateTamaguiConfig(options)
  const context = await esbuild.context({
    entryPoints: [options.tamaguiOptions.config],
    sourcemap: false,
    // dont output just use esbuild as a watcher
    write: false,

    plugins: [
      {
        name: `on-rebuild`,
        setup({ onEnd }) {
          onEnd((res) => {
            generateTamaguiConfig(options)
          })
        },
      },
    ],
  })

  await context.watch()
}

const defaultPaths = ['tamagui.config.ts', join('src', 'tamagui.config.ts')]
let cachedPath = ''

async function getDefaultTamaguiConfigPath() {
  if (cachedPath) return cachedPath
  const existingPaths = await Promise.all(defaultPaths.map((path) => pathExists(path)))
  const existing = existingPaths.findIndex((x) => !!x)
  const found = defaultPaths[existing]
  if (!found) {
    throw new Error(`No found tamagui.config.ts`)
  }
  cachedPath = found
  return found
}

export { TamaguiProjectInfo }