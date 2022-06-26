import { join } from 'path'

import type { StaticConfig, TamaguiComponent, TamaguiInternalConfig } from '@tamagui/core'
import { createTamagui } from '@tamagui/core-node'

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

    const proxyWorm = require('@tamagui/proxy-worm')
    const rnw = require('react-native-web')
    const Mod = require('module')
    const og = Mod.prototype.require
    const nameToPaths: NameToPaths = {}

    Mod.prototype.require = function (path: string) {
      if (path.endsWith('.css')) {
        return {}
      }
      if (
        path === '@gorhom/bottom-sheet' ||
        path.startsWith('react-native-reanimated') ||
        path === 'expo-linear-gradient'
      ) {
        return proxyWorm
      }
      if (
        path.startsWith('react-native') &&
        // allow our rnw.tsx imports through
        !path.startsWith('react-native-web/dist/cjs/exports')
      ) {
        return rnw
      }
      try {
        const out = og.apply(this, arguments)
        if (!nameToPaths[path]) {
          if (out && typeof out === 'object') {
            for (const key in out) {
              try {
                const conf = out[key]?.staticConfig as StaticConfig
                if (conf) {
                  if (conf.componentName) {
                    nameToPaths[conf.componentName] ??= new Set()
                    const fullName = path.startsWith('.')
                      ? join(`${this.path.replace(/dist(\/cjs)?/, 'src')}`, path)
                      : path
                    nameToPaths[conf.componentName].add(fullName)
                  } else {
                    // console.log('no name component', path)
                  }
                }
              } catch {
                // ok
              }
            }
          }
        }
        return out
      } catch (err: any) {
        console.error('Tamagui error loading file:\n', path, err.message, '\n', err.stack)
        // avoid infinite loops
        process.exit(1)
      }
    }

    // import config
    const exp = require(configPath)
    const tamaguiConfig = (exp['default'] || exp) as TamaguiInternalConfig

    if (!tamaguiConfig || !tamaguiConfig.parsed) {
      try {
        const confPath = require.resolve(configPath)
        console.log(`Received:`, tamaguiConfig)
        throw new Error(`Can't find valid config in ${confPath}`)
      } catch (err) {
        throw err
      }
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
    Mod.prototype.require = og

    // set up core-node
    createTamagui(tamaguiConfig as any)

    loadedTamagui = {
      components,
      tamaguiConfig,
      nameToPaths,
    }

    return loadedTamagui
  } catch (err) {
    console.log('Error loading Tamagui', err)
    throw err
  } finally {
    unregister()
  }
}
