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
 * import '@tamagui/native/expo-linear-gradient'
 *
 * // Then use Tamagui components normally
 * // Sheet will automatically use native gestures when available
 * // LinearGradient will use expo-linear-gradient when installed
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
  LinearGradientState,
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

// linear gradient
export { getLinearGradient } from './linearGradientState'
export type { LinearGradientAccessor } from './linearGradientState'

// components
export { NativePortal, NativePortalHost, NativePortalProvider } from './components'

// optimized components for compiler output
export { _TamaguiView, type TamaguiViewProps } from './_TamaguiView'
export { _TamaguiText, type TamaguiTextProps } from './_TamaguiText'
