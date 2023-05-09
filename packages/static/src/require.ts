import { relative, sep } from 'path'

const nameToPaths = {}
const Module = require('module')
const og = Module.prototype.require
globalThis['ogRequire'] = og

export const getNameToPaths = () => nameToPaths

const proxyWorm = require('@tamagui/proxy-worm')
// TODO can swap with react-native-web-lite
const rnw = require('react-native-web')
const core = require('@tamagui/core-node')

let isRegistered = false

export function registerRequire() {
  // already registered
  if (isRegistered) {
    return () => {}
  }

  isRegistered = true

  Module.prototype.require = tamaguiRequire

  return () => {
    // unregister
    isRegistered = false
    Module.prototype.require = og
  }
}

function tamaguiRequire(this: any, path: string) {
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
    path === 'react-native-web-lite' ||
    (path.startsWith('react-native') &&
      // allow our rnw.tsx imports through
      !path.startsWith('react-native-web/dist/cjs/exports'.replace(/\//g, sep)))
  ) {
    return rnw
  }
  if (
    path === '@tamagui/core' ||
    path === '@tamagui/core-node' ||
    path === '@tamagui/web'
  ) {
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
