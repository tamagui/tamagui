// safe exports - no react-native or react-native-teleport imports
// for setup, import from '@tamagui/native-portal/setup' on native only

export { getNativePortalState, setNativePortalState } from './state'
export type { NativePortalState } from './state'

export { NativePortal, NativePortalHost, NativePortalProvider } from './components'
export type {
  NativePortalProps,
  NativePortalHostProps,
  NativePortalProviderProps,
} from './components'
