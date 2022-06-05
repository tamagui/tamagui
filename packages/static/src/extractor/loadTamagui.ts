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

  const configPath = join(process.cwd(), props.config)

  // threaded caching avoiding 1s loading of large configs every save
  // const cachePath = join(cacheDir, 'tamagui-conf-cached.json')
  // const confStat = statSync(configPath)

  // // TODO may want to disable, its pretty optimistic at caching...
  // try {
  //   const confCache = readFileSync(cachePath, 'utf-8')
  //   const confParsed = JSON.parse(confCache)
  //   if (confParsed && confParsed.mtime === confStat.mtime) {
  //     return confParsed.value
  //   }
  // } catch {
  //   // ok, no cache
  // }

  const x = Math.random()
  console.trace('register', x)
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
    Mod.prototype.require = function (path: string) {
      console.log('load', path)
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
        return og.apply(this, arguments)
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
        const staticConfig = val?.staticConfig
        if (staticConfig) {
          Object.assign(components, { [Name]: { staticConfig } })
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
    }

    // save cache
    // try {
    //   writeFileSync(
    //     cachePath,
    //     JSON.stringify({
    //       value: loadedTamagui,
    //       mtime: confStat.mtime,
    //     })
    //   )
    // } catch (err: any) {
    //   console.log(`Error: tamagui config not stringifiable, caching disabled "${err.message}"`)
    // }

    return loadedTamagui
  } catch (err) {
    throw err
  } finally {
    console.log('unregister', x)
    unregister()
  }
}
