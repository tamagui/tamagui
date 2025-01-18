import { register } from 'esbuild-register/dist/node'

import { esbuildIgnoreFilesRegex } from './extractor/bundle'
import { requireTamaguiCore } from './helpers/requireTamaguiCore'
import type { TamaguiPlatform } from './types'

const nameToPaths = {}

export const getNameToPaths = () => nameToPaths

const Module = require('node:module')
const proxyWorm = require('@tamagui/proxy-worm')

let isRegistered = false
let og: any

const whitelisted = {
  react: true,
}

const compiled = {}
export function setRequireResult(name: string, result: any) {
  compiled[name] = result
}

export function registerRequire(
  platform: TamaguiPlatform,
  { proxyWormImports } = {
    proxyWormImports: false,
  }
) {
  // already registered
  if (isRegistered) {
    return {
      tamaguiRequire: require,
      unregister: () => {},
    }
  }

  const { unregister } = register({
    hookIgnoreNodeModules: false,
  })

  if (!og) {
    og = Module.prototype.require // capture esbuild require
  }

  isRegistered = true

  Module.prototype.require = tamaguiRequire

  function tamaguiRequire(this: any, path: string) {
    if (path === 'tamagui' && platform === 'native') {
      return og.apply(this, ['tamagui/native'])
    }

    if (path === '@tamagui/core' || path === '@tamagui/web') {
      return requireTamaguiCore(platform, (path) => {
        return og.apply(this, [path])
      })
    }

    if (
      path in knownIgnorableModules ||
      path.startsWith('react-native-reanimated') ||
      esbuildIgnoreFilesRegex.test(path)
    ) {
      return proxyWorm
    }

    if (path in compiled) {
      return compiled[path]
    }

    if (path === 'react-native-svg') {
      return og.apply(this, ['@tamagui/react-native-svg'])
    }

    if (path === 'react-native/package.json') {
      return og.apply(this, ['react-native-web/package.json'])
    }

    if (
      path === '@tamagui/react-native-web-lite' ||
      path === 'react-native' ||
      path.startsWith('react-native/')
    ) {
      try {
        return og.apply('react-native')
      } catch {
        return og.apply(this, ['@tamagui/react-native-web-lite'])
      }
    }

    if (!whitelisted[path]) {
      if (proxyWormImports && !path.includes('.tamagui-dynamic-eval')) {
        if (path === 'tamagui') {
          return og.apply(this, [path])
        }
        return proxyWorm
      }
    }

    try {
      const out = og.apply(this, arguments)
      // only for studio disable for now
      // if (!nameToPaths[path]) {
      //   if (out && typeof out === 'object') {
      //     for (const key in out) {
      //       try {
      //         const conf = out[key]?.staticConfig as StaticConfig
      //         if (conf) {
      //           if (conf.componentName) {
      //             nameToPaths[conf.componentName] ??= new Set()
      //             const fullName = path.startsWith('.')
      //               ? join(`${this.path.replace(/dist(\/cjs)?/, 'src')}`, path)
      //               : path
      //             nameToPaths[conf.componentName].add(fullName)
      //           } else {
      //             // console.log('no name component', path)
      //           }
      //         }
      //       } catch {
      //         // ok
      //       }
      //     }
      //   }
      // }
      return out
    } catch (err: any) {
      if (
        !process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD &&
        path.includes('tamagui-dynamic-eval')
      ) {
        // ok, dynamic eval fails
        return
      }
      if (allowedIgnores[path] || IGNORES === 'true') {
        // ignore
      } else if (!process.env.TAMAGUI_SHOW_FULL_BUNDLE_ERRORS && !process.env.DEBUG) {
        if (hasWarnedForModules.has(path)) {
          // ignore
        } else {
          hasWarnedForModules.add(path)
          console.info(
            `  tamagui: skipping ${path} tamagui.dev/docs/intro/errors#warning-001`
          )
        }
      } else {
        /**
         * Allow errors to happen, we're just reading config and components but sometimes external modules cause problems
         * We can't fix every problem, so just swap them out with proxyWorm which is a sort of generic object that can be read.
         */

        console.error(
          `Tamagui failed to require() "${path}"
  
  ${err.message}
  ${err.stack}

  `
        )
      }

      return proxyWorm
    }
  }

  return {
    tamaguiRequire,
    unregister: () => {
      unregister()
      isRegistered = false
      Module.prototype.require = og
    },
  }
}

const IGNORES = process.env.TAMAGUI_IGNORE_BUNDLE_ERRORS
const extraIgnores =
  IGNORES === 'true' ? [] : process.env.TAMAGUI_IGNORE_BUNDLE_ERRORS?.split(',')

const knownIgnorableModules = {
  '@gorhom/bottom-sheet': true,
  'expo-modules': true,
  solito: true,
  'expo-linear-gradient': true,
  '@expo/vector-icons': true,
  'tamagui/linear-gradient': true,
  ...Object.fromEntries(extraIgnores?.map((k) => [k, true]) || []),
}

const hasWarnedForModules = new Set<string>()

const allowedIgnores = {
  'expo-constants': true,
  './ExpoHaptics': true,
  './js/MaskedView': true,
}
