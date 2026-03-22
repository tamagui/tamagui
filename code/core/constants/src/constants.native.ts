import { useLayoutEffect, type useEffect } from 'react'
import { Platform } from 'react-native'

export const isWeb: boolean = false
export const isBrowser: boolean = false
export const isServer: boolean = false
export const isClient: boolean = true
/** @deprecated use isBrowser instead */
export const isWindowDefined: boolean = false
export const useIsomorphicLayoutEffect: typeof useEffect = useLayoutEffect
export const isChrome: boolean = false
export const isWebTouchable: boolean = false
export const isTouchable: boolean = true
// optional chain required: babel extractor loads native.cjs in node where Platform is undefined
// On Android TV: Platform.OS === 'android' per react-native-tvos
export const isAndroid: boolean =
  Platform?.OS === 'android' ||
  process.env.TEST_NATIVE_PLATFORM === 'android' ||
  process.env.TEST_NATIVE_PLATFORM === 'androidtv'
// On tvOS: Platform.OS === 'ios' per react-native-tvos
export const isIos: boolean =
  Platform?.OS === 'ios' ||
  process.env.TEST_NATIVE_PLATFORM === 'ios' ||
  process.env.TEST_NATIVE_PLATFORM === 'tvos'
export const isTV: boolean =
  Platform?.isTV ||
  process.env.TEST_NATIVE_PLATFORM === 'androidtv' ||
  process.env.TEST_NATIVE_PLATFORM === 'tvos'

const platforms = { ios: 'ios', android: 'android' } as const
// currentPlatform reflects Platform.OS - TV platforms are intentionally NOT separate values here:
// - Android TV has Platform.OS === 'android' (react-native-tvos behavior)
// - tvOS has Platform.OS === 'ios' (react-native-tvos behavior)
// Use isTV combined with isAndroid/isIos to detect specific TV platforms.
/** @note TV platforms ('androidtv', 'tvos') are not included here because react-native-tvos reports Platform.OS as 'android'/'ios'. Use isTV + isAndroid/isIos to detect TV. */
export const currentPlatform: 'web' | 'ios' | 'native' | 'android' =
  (Platform?.OS ? platforms[Platform.OS] : undefined) || 'native'
