// re-export from @tamagui/native-portal for backwards compatibility
// these exports are safe for web - no react-native or teleport imports
//
// for setupNativePortal, import directly from '@tamagui/native-portal/setup'
// which should only be used in native entry points (e.g., index.js)

export { getNativePortalState } from '@tamagui/native-portal'
export type { NativePortalState } from '@tamagui/native-portal'
