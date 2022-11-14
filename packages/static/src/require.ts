import { relative, sep } from 'path'

import { SHOULD_DEBUG } from './constants.js'

const nameToPaths = {}
const Module = require('module')
const og = Module.prototype.require
globalThis['ogRequire'] = og

export const getNameToPaths = () => nameToPaths

export function registerRequire() {
  if (Module.prototype.require !== globalThis['ogRequire']) {
    // eslint-disable-next-line no-console
    console.warn('didnt unregister before re-registering')
    process.exit(1)
  }

  const proxyWorm = require('@tamagui/proxy-worm')
  // TODO can swap with react-native-web-lite
  const rnw = require('react-native-web')
  const core = require('@tamagui/core-node')

  Module.prototype.require = function (path: string) {
    if (/\.(gif|jpe?g|png|svg|ttf|otf|woff2?|bmp|webp)$/.test(path)) {
      return {}
    }
    if (
      path === '@gorhom/bottom-sheet' ||
      path.startsWith('react-native-reanimated') ||
      path === 'expo-linear-gradient' ||
      path === '@expo/vector-icons'
    ) {
      return proxyWorm
    }
    if (
      path.startsWith('react-native') &&
      // allow our rnw.tsx imports through
      !path.startsWith('react-native-web/dist/cjs/exports'.replace(/\//g, sep))
    ) {
      return rnw
    }
    if (path === '@tamagui/core') {
      return core
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
      /**
       * Allow errors to happen, we're just reading config and components but sometimes external modules cause problems
       * We can't fix every problem, so just swap them out with proxyWorm which is a sort of generic object that can be read.
       */

      if (process.env.DEBUG?.startsWith('tamagui')) {
        // eslint-disable-next-line no-console
        console.error(
          `Tamagui failed loading the pre-built tamagui.config.ts
  
  ${err.message}
  ${err.stack}
  
    You can see if it loads in the node repl:
  
    require("./${relative(process.cwd(), path)}").default
  
  `
        )
      }

      return proxyWorm
    }
  }

  return Module.prototype.require
}

export function unregisterRequire() {
  Module.prototype.require = og
}
