/**
 * @tamagui/native
 *
 * Native setup modules for Tamagui. Import these at the top of your app entry point.
 *
 * @example
 * ```tsx
 * // In your app entry (index.js or App.tsx)
 * import '@tamagui/native/setup-portal'
 * import '@tamagui/native/setup-gesture-handler'
 * import '@tamagui/native/setup-worklets'
 *
 * // Then use Tamagui components normally
 * // Sheet will automatically use native gestures when available
 * ```
 */

// portal state exports (safe - no side effects)
export { getNativePortalState, setNativePortalState } from './portalState'
export type { NativePortalState } from './portalState'

export { NativePortal, NativePortalHost, NativePortalProvider } from './components'
export type {
  NativePortalProps,
  NativePortalHostProps,
  NativePortalProviderProps,
} from './components'

// gesture handler state exports (safe - no side effects)
export {
  isGestureHandlerEnabled,
  getGestureHandlerState,
  setGestureHandlerState,
} from './gestureState'
export type { GestureState } from './gestureState'

// worklets state exports (safe - no side effects)
export { isWorkletsEnabled, getWorkletsState } from './workletsState'
export type { WorkletsState } from './workletsState'
