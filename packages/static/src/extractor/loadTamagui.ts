import { basename, dirname, extname, join, resolve } from 'path'

import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import { createTamagui } from '@tamagui/core-node'
import { CLIResolvedOptions, CLIUserOptions, TamaguiOptions } from '@tamagui/types'
import type { TamaguiInternalConfig } from '@tamagui/web'
import esbuild from 'esbuild'
import fs, { existsSync, pathExists, readJSON } from 'fs-extra'

import { SHOULD_DEBUG } from '../constants.js'
import { getNameToPaths, registerRequire } from '../require.js'
import {
  TamaguiProjectInfo,
  esbuildOptions,
  getBundledConfig,
  loadComponents,
} from './bundleConfig.js'
import {
  generateTamaguiStudioConfig,
  generateTamaguiStudioConfigSync,
} from './generateTamaguiStudioConfig.js'

const getFilledOptions = (propsIn: Partial<TamaguiOptions>): TamaguiOptions => ({
  // defaults
  config: 'tamagui.config.ts',
  components: ['tamagui'],
  ...(propsIn as Partial<TamaguiOptions>),
})

export async function loadTamagui(propsIn: TamaguiOptions): Promise<TamaguiProjectInfo> {
  const props = getFilledOptions(propsIn)

  const unregister = registerRequire()
  try {
    const bundleInfo = await getBundledConfig(props)
    await generateTamaguiStudioConfig(props, bundleInfo)
    // init core-node
    createTamagui(bundleInfo.tamaguiConfig)
    return bundleInfo
  } finally {
    unregister()
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
export function loadTamaguiSync(propsIn: TamaguiOptions): TamaguiProjectInfo {
  const props = getFilledOptions(propsIn)
  const { unregister } = require('esbuild-register/dist/node').register(esbuildOptions)

  const unregisterRequire = registerRequire()
  try {
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

      const info = {
        components,
        tamaguiConfig,
        nameToPaths: getNameToPaths(),
      }

      generateTamaguiStudioConfigSync(props, info)

      return info as any
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

export async function watchTamaguiConfig(tamaguiOptions: TamaguiOptions) {
  const options = await getOptions({ tamaguiOptions })

  if (!options.tamaguiOptions.config) {
    throw new Error(`No config`)
  }

  const context = await esbuild.context({
    entryPoints: [options.tamaguiOptions.config],
    sourcemap: false,
    // dont output just use esbuild as a watcher
    write: false,

    plugins: [
      {
        name: `on-rebuild`,
        setup({ onEnd }) {
          onEnd(() => {
            generateTamaguiStudioConfig(options.tamaguiOptions, null, true)
          })
        },
      },
    ],
  })

  const promise = context.watch()

  return {
    context,
    promise,
  }
}
