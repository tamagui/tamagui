/**
 * @tamagui/native
 *
 * Native setup modules for Tamagui. Import these at the top of your app entry point.
 *
 * @example
 * ```tsx
 * // In your app entry (index.js or App.tsx)
 * import '@tamagui/native/setup-teleport'
 * import '@tamagui/native/setup-gesture-handler'
 * import '@tamagui/native/setup-worklets'
 * import '@tamagui/native/setup-safe-area'
 * ```
 */

// types
export type {
  NativePortalState,
  GestureState,
  WorkletsState,
  SafeAreaState,
  SafeAreaInsets,
  SafeAreaFrame,
  SafeAreaMetrics,
  NativePortalProps,
  NativePortalHostProps,
  NativePortalProviderProps,
} from './types'

// portal
export { getPortal } from './portalState'
export type { PortalAccessor } from './portalState'

// gesture handler
export { getGestureHandler } from './gestureState'
export type { GestureHandlerAccessor, PressGestureConfig } from './gestureState'

// worklets
export { getWorklets } from './workletsState'
export type { WorkletsAccessor } from './workletsState'

// safe area
export { getSafeArea } from './safeAreaState'
export type { SafeAreaAccessor } from './safeAreaState'

// components
export { NativePortal, NativePortalHost, NativePortalProvider } from './components'
