import { join } from 'path'

import type { TamaguiComponent, TamaguiInternalConfig } from '@tamagui/core'
import { createTamagui } from '@tamagui/core-node'

let loadedTamagui: any = null

export function loadTamagui(props: { components: string[]; config: string }): {
  components: Record<string, TamaguiComponent>
  tamaguiConfig: TamaguiInternalConfig
} {
  if (loadedTamagui) {
    return loadedTamagui
  }

  // lets shim require and avoid importing react-native + react-native-web
  // we just need to read the config around them
  process.env.IS_STATIC = 'is_static'
  const proxyWorm = require('@tamagui/proxy-worm')
  const rnw = require('react-native-web')
  const Mod = require('module')
  const og = Mod.prototype.require
  Mod.prototype.require = function (path: string) {
    if (path.endsWith('.css')) {
      return {}
    }
    if (path === '@gorhom/bottom-sheet' || path.startsWith('react-native-reanimated')) {
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
      return og.apply(this, arguments)
    } catch (err: any) {
      console.error('Tamagui error loading file:\n')
      console.log('   ', path, '\n')
      console.log(err.message)
      console.log(err.stack)
      // avoid infinite loops
      process.exit(1)
    }
  }

  // import config
  const configPath = join(process.cwd(), props.config)
  const tamaguiConfigExport = require(configPath)
  const tamaguiConfig = (tamaguiConfigExport['default'] ||
    tamaguiConfigExport) as TamaguiInternalConfig

  if (!tamaguiConfig || !tamaguiConfig.parsed) {
    try {
      const confPath = require.resolve(configPath)
      console.log(`Received:`, tamaguiConfigExport)
      throw new Error(`Can't find valid config in ${confPath}`)
    } catch (err) {
      throw err
    }
  }

  // import components
  const components = {}
  for (const module of props.components) {
    const exported = require(module)
    Object.assign(components, exported)
  }

  // undo shims
  process.env.IS_STATIC = undefined
  Mod.prototype.require = og

  // set up core-node
  createTamagui(tamaguiConfig as any)

  loadedTamagui = {
    components,
    tamaguiConfig,
  }

  return loadedTamagui
}
