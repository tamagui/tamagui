/* eslint-disable no-console */
import { join, sep } from 'path'

import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import type { StaticConfig, TamaguiComponent, TamaguiInternalConfig } from '@tamagui/core-node'
import { createTamagui } from '@tamagui/core-node'
import esbuild from 'esbuild'
import { remove } from 'fs-extra'

import { SHOULD_DEBUG } from '../constants'
import { getNameToPaths, registerRequire, unregisterRequire } from '../require'

let loadedTamagui: TamaguiProjectInfo | null = null

type NameToPaths = {
  [key: string]: Set<string>
}

export type TamaguiProjectInfo = {
  components: Record<string, TamaguiComponent>
  tamaguiConfig: TamaguiInternalConfig
  nameToPaths: NameToPaths
}

type Props = { components: string[]; config: string }

// TODO stat dirs to determine re-build or just clear after debounce

export async function loadTamagui(props: Props): Promise<TamaguiProjectInfo> {
  if (loadedTamagui) {
    return loadedTamagui
  }

  const configPath = join(process.cwd(), props.config)
  const tmpDir = join(process.cwd(), 'dist', 'tamagui-node')
  const configOutPath = join(tmpDir, `tamagui.config.js`)
  const includesCore = props.components.includes('@tamagui/core')
  const components = props.components.filter((x) => x !== '@tamagui/core')
  const componentOutPaths = components.map((componentModule) =>
    join(tmpDir, `${componentModule.split(sep).join('-')}-components.config.js`)
  )

  await Promise.all([configOutPath, ...componentOutPaths].map((p) => remove(p)))

  // build them to node-compat versions
  await Promise.all([
    buildTamaguiConfig({
      entryPoints: [configPath],
      external: ['@tamagui/core', '@tamagui/core-node'],
      outfile: configOutPath,
    }),
    ...components.map((componentModule, i) => {
      return buildTamaguiConfig({
        entryPoints: [componentModule],
        external: ['@tamagui/core', '@tamagui/core-node'],
        outfile: componentOutPaths[i],
      })
    }),
  ])

  registerRequire()
  const config = require(configOutPath).default

  loadedTamagui = {
    components: {
      ...loadComponents(componentOutPaths),
      ...(includesCore && {
        '@tamagui/core': require('@tamagui/core-node'),
      }),
    },
    nameToPaths: {},
    tamaguiConfig: config,
  }

  unregisterRequire()

  // init core-node
  createTamagui(loadedTamagui.tamaguiConfig)

  return loadedTamagui
}

async function buildTamaguiConfig(options: Partial<esbuild.BuildOptions>) {
  const alias = require('@tamagui/core-node').aliasPlugin
  return esbuild.build({
    bundle: true,
    ...options,
    format: 'cjs',
    target: 'node18',
    keepNames: false,
    platform: 'node',
    allowOverwrite: true,
    banner: {
      // insert a shim that re-routes:
      //   react-native => react-native-web-lite
      //   @tamagui/core => @tamagui/core-node
      // doing it this way gives us nice node REPL require'able configs
      js: `
// tamagui re-wire some deps for node
const mod = require('module')
const og = mod.prototype.require
const core = require('@tamagui/core-node')
const rnw = require('react-native-web-lite')
mod.prototype.require = function(path) {
  if (path === '@tamagui/core') return core
  if (path === 'react-native') return rnw
  return og(path)
}
`,
    },
    logLevel: 'warning',
    plugins: [
      alias({
        'react-native': require.resolve('react-native-web-lite'),
        'react-native-safe-area-context': require.resolve('@tamagui/fake-react-native'),
        'react-native-gesture-handler': require.resolve('@tamagui/proxy-worm'),
      }),
    ],
  })
}

// loads in-process using esbuild-register
export function loadTamaguiSync(props: Props): TamaguiProjectInfo {
  if (loadedTamagui) {
    return loadedTamagui
  }

  const configPath = join(process.cwd(), props.config)

  const { unregister } = require('esbuild-register/dist/node').register({
    target: 'es2019',
    format: 'cjs',
  }).unregister

  try {
    registerRequire()

    // lets shim require and avoid importing react-native + react-native-web
    // we just need to read the config around them
    process.env.IS_STATIC = 'is_static'
    // @ts-ignore
    if (typeof globalThis['__DEV__'] === 'undefined') {
      // @ts-ignore
      globalThis['__DEV__'] = process.env.NODE_ENV === 'development'
    }

    try {
      // import config
      const exp = require(configPath)
      const tamaguiConfig = (exp['default'] || exp) as TamaguiInternalConfig

      if (!tamaguiConfig || !tamaguiConfig.parsed) {
        const confPath = require.resolve(configPath)
        console.log(`Received:`, tamaguiConfig)
        throw new Error(`Can't find valid config in ${confPath}`)
      }

      const components = loadComponents(props.components)

      // undo shims
      process.env.IS_STATIC = undefined

      // set up core-node
      createTamagui(tamaguiConfig)

      loadedTamagui = {
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
        components: {},
        tamaguiConfig: getDefaultTamaguiConfig(),
        nameToPaths: {},
      }
    }

    return loadedTamagui
  } catch (err) {
    console.log('Error loading Tamagui', err)
    throw err
  } finally {
    unregister()
    unregisterRequire()
  }
}

function loadComponents(componentsModules: string[]) {
  // import components
  const components = {}
  for (const moduleName of componentsModules) {
    try {
      const exported = require(moduleName)
      for (const Name in exported) {
        const val = exported[Name]
        const staticConfig = val?.staticConfig as StaticConfig | undefined
        if (staticConfig) {
          // remove non-stringifyable
          const { Component, reactNativeWebComponent, ...sc } = staticConfig
          Object.assign(components, { [Name]: { staticConfig: sc } })
        }
      }
    } catch (err) {
      console.error(`Tamagui failed loading components from: ${moduleName}`)
      throw err
    }
  }
  return components
}
