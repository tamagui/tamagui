import { setNativePortalState } from './state'

const IS_FABRIC =
  typeof global !== 'undefined' &&
  Boolean((global as any)._IS_FABRIC ?? (global as any).nativeFabricUIManager)

/**
 * Sets up native portal support for React Native.
 * Call this function early in your app (e.g., in index.js) to enable native portals.
 *
 * If react-native-teleport is installed, it will be used automatically (recommended).
 * Otherwise falls back to legacy RN shims approach.
 */
export const setupNativePortal = (): void => {
  const g = globalThis as any
  if (g.__tamagui_native_portal_setup) return
  g.__tamagui_native_portal_setup = true

  // try teleport first (preferred)
  try {
    const teleport = require('react-native-teleport')
    if (teleport?.Portal && teleport?.PortalHost && teleport?.PortalProvider) {
      g.__tamagui_teleport = teleport
      setNativePortalState({ enabled: true, type: 'teleport' })
      return
    }
  } catch {
    // teleport not installed, try legacy
  }

  // fall back to legacy RN shims approach
  if (IS_FABRIC) {
    try {
      const mod = require('react-native/Libraries/Renderer/shims/ReactFabric')
      g.__tamagui_portal_create = mod?.default?.createPortal ?? mod.createPortal
      setNativePortalState({ enabled: true, type: 'legacy' })
    } catch (err) {
      console.info(`Note: error importing fabric portal, native portals disabled`, err)
    }
    return
  }

  try {
    const mod = require('react-native/Libraries/Renderer/shims/ReactNative')
    g.__tamagui_portal_create = mod?.default?.createPortal ?? mod.createPortal
    setNativePortalState({ enabled: true, type: 'legacy' })
  } catch (err) {
    console.info(`Note: error importing native portal, native portals disabled`, err)
  }
}
