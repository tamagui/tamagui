import { join } from 'path'

import type { StaticConfig, TamaguiComponent, TamaguiInternalConfig } from '@tamagui/core-node'
import { createTamagui } from '@tamagui/core-node'

import { SHOULD_DEBUG } from '../constants'
import { getNameToPaths, registerRequire, unregisterRequire } from '../require'
import { config as defaultTamaguiConfig } from './defaultTamaguiConfig'

let loadedTamagui: any = null

type NameToPaths = {
  [key: string]: Set<string>
}

export type TamaguiProjectInfo = {
  components: Record<string, TamaguiComponent>
  tamaguiConfig: TamaguiInternalConfig
  nameToPaths: NameToPaths
}

export function loadTamagui(props: { components: string[]; config: string }): TamaguiProjectInfo {
  console.trace('load', !!loadedTamagui)

  if (loadedTamagui) {
    return loadedTamagui
  }

  const configPath = join(process.cwd(), props.config)

  const { unregister } = require('esbuild-register/dist/node').register({
    target: 'es2019',
    format: 'cjs',
  })

  try {
    // lets shim require and avoid importing react-native + react-native-web
    // we just need to read the config around them
    process.env.IS_STATIC = 'is_static'
    // @ts-ignore
    if (typeof globalThis['__DEV__'] === 'undefined') {
      // @ts-ignore
      globalThis['__DEV__'] = process.env.NODE_ENV === 'development'
    }

    registerRequire()

    try {
      // import config
      const exp = require(configPath)
      const tamaguiConfig = (exp['default'] || exp) as TamaguiInternalConfig

      if (!tamaguiConfig || !tamaguiConfig.parsed) {
        const confPath = require.resolve(configPath)
        console.log(`Received:`, tamaguiConfig)
        throw new Error(`Can't find valid config in ${confPath}`)
      }

      // import components
      const components = {}
      for (const moduleName of props.components) {
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
      }

      // undo shims
      process.env.IS_STATIC = undefined

      // set up core-node
      createTamagui(tamaguiConfig as any)

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
        tamaguiConfig: defaultTamaguiConfig,
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
