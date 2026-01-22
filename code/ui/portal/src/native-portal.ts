// native portal setup - must be explicitly imported to avoid RN 0.81+ compatibility issues
// usage: import { setupNativePortal } from '@tamagui/portal/native-portal'
// call setupNativePortal() early in your app to enable native portals

const IS_FABRIC =
  typeof global !== 'undefined' &&
  Boolean((global as any)._IS_FABRIC ?? (global as any).nativeFabricUIManager)

/**
 * Sets up native portal support for React Native.
 * Call this function early in your app (e.g., in index.js) to enable native portals.
 *
 * This is opt-in to avoid compatibility issues with RN 0.81+ where the
 * react-native shim imports can fail with "property is not writable" errors.
 */
export const setupNativePortal = (): void => {
  const g = globalThis as any
  if (g.__tamagui_portal_create) return

  if (IS_FABRIC) {
    try {
      const mod = require('react-native/Libraries/Renderer/shims/ReactFabric')
      g.__tamagui_portal_create = mod?.default?.createPortal ?? mod.createPortal
    } catch (err) {
      console.info(`Note: error importing fabric portal, native portals disabled`, err)
    }
    return
  }

  try {
    const mod = require('react-native/Libraries/Renderer/shims/ReactNative')
    g.__tamagui_portal_create = mod?.default?.createPortal ?? mod.createPortal
  } catch (err) {
    console.info(`Note: error importing native portal, native portals disabled`, err)
  }
}
