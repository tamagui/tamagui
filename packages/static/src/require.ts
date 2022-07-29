import { join } from 'path'

import type { StaticConfig } from '@tamagui/core-node'

import { SHOULD_DEBUG } from './constants'

const nameToPaths = {}
const Module = require('module')
const og = Module.prototype.require
globalThis['ogRequire'] = og

export const getNameToPaths = () => nameToPaths

// just for catching egregious amounts of errors in a tight loop
let tries = 0
setInterval(() => {
  tries = 0
}, 50)

export function registerRequire() {
  if (Module.prototype.require !== globalThis['ogRequire']) {
    console.warn('didnt unregister before re-registering')
    process.exit(1)
  }

  const proxyWorm = require('@tamagui/proxy-worm')
  const rnw = require('react-native-web')
  const core = require('@tamagui/core-node')

  Module.prototype.require = function (path: string) {
    if (SHOULD_DEBUG) {
      console.log('tamagui require', path)
    }
    if (path.endsWith('.css') || path.endsWith('.json') || path.endsWith('.ttf')) {
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
      !path.startsWith('react-native-web/dist/cjs/exports')
    ) {
      return rnw
      // return og('react-native-web')
    }
    if (path === '@tamagui/core') {
      return core
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
      if (SHOULD_DEBUG) {
        console.error(
          `Tamagui failed requiring ${path} from your tamagui.config.ts file, ignoring\n`,
          err.message,
          err.stack
        )
      }
      const max = process.env.TAMAGUI_MAX_ERRORS ? +process.env.TAMAGUI_MAX_ERRORS : 200
      if (++tries > max) {
        console.log(
          `Too many errors loading design system, exiting (set TAMAGUI_MAX_ERRORS to override)..`
        )
        // avoid infinite loops
        process.exit(1)
      }
      // return proxyWorm by default
      return proxyWorm
    }
  }

  return Module.prototype.require
}

export function unregisterRequire() {
  Module.prototype.require = og
}
