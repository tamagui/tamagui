import { join } from 'path'

import type { StaticConfig } from '@tamagui/core-node'

import { SHOULD_DEBUG } from './constants'

const nameToPaths = {}
const Mod = require('module')
const og = Mod.prototype.require
globalThis['ogRequire'] = og

export const getNameToPaths = () => nameToPaths

let tries = 0
setInterval(() => {
  tries = 0
}, 500)

export function registerRequire() {
  if (Mod.prototype.require !== globalThis['ogRequire']) {
    console.warn('didnt unregister before re-registering')
    process.exit(1)
  }

  const proxyWorm = require('@tamagui/proxy-worm')
  const rnw = require('react-native-web')

  Mod.prototype.require = function (path: string) {
    if (SHOULD_DEBUG) {
      console.log('tamagui require', path)
    }
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
      // return og('react-native-web')
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
      console.error(
        `Tamagui failed requiring ${path} from your tamagui.config.ts file, ignoring (set DEBUG=tamagui to see stack)\n`,
        err.message
      )
      if (SHOULD_DEBUG) {
        console.log(err.stack)
      }
      if (++tries > 10) {
        // avoid infinite loops
        process.exit(1)
      }
    }
  }
}

export function unregisterRequire() {
  Mod.prototype.require = og
}
