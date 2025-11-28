/**
 * Legacy portal using React Native deep imports.
 * This worked well enough before but was always a hack.
 *
 * Usage:
 * ```ts
 * import { createPortal } from '@tamagui/portal/legacy-portal'
 * import { setupPortal } from '@tamagui/portal'
 *
 * if (createPortal) {
 *   setupPortal({ createPortal })
 * }
 * ```
 *
 * This uses deprecated deep imports from react-native which will be removed
 * in a future React Native version. Only use this if you need native portal
 * support and are on React Native < 0.82.
 */

import type { CreatePortalFn } from './setupPortal'

export const IS_FABRIC =
  typeof global !== 'undefined' &&
  Boolean(global._IS_FABRIC ?? global.nativeFabricUIManager)

export const createPortal: CreatePortalFn | null = (() => {
  if (IS_FABRIC) {
    try {
      const ReactFabricShimModule = require('react-native/Libraries/Renderer/shims/ReactFabric')
      return (
        ReactFabricShimModule?.default?.createPortal ?? ReactFabricShimModule.createPortal
      )
    } catch (err) {
      console.info(`Note: error importing ReactFabric portal`, err)
    }
  } else {
    try {
      const ReactNativeShimModule = require('react-native/Libraries/Renderer/shims/ReactNative')
      return (
        ReactNativeShimModule?.default?.createPortal ?? ReactNativeShimModule.createPortal
      )
    } catch (err) {
      console.info(`Note: error importing ReactNative portal`, err)
    }
  }
  return null
})()
