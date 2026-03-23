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
/**
 * Reflects Platform.OS. TV platforms are intentionally NOT separate values:
 * - Android TV has Platform.OS === 'android' (react-native-tvos behavior)
 * - tvOS has Platform.OS === 'ios' (react-native-tvos behavior)
 * Use `isTV` combined with `isAndroid`/`isIos` to detect specific TV platforms.
 */
export const currentPlatform: 'web' | 'ios' | 'native' | 'android' =
  (Platform?.OS ? platforms[Platform.OS] : undefined) || 'native'

// In Metro source mode, TAMAGUI_TARGET may not be set by the build tool.
// Set it here so all process.env.TAMAGUI_TARGET runtime checks work correctly.
// In pre-built dist, the build tool inlines TAMAGUI_TARGET as a literal string,
// making this block dead code (if (!'native') → never executes).
if (!process.env.TAMAGUI_TARGET) {
  process.env.TAMAGUI_TARGET = 'native'
}
