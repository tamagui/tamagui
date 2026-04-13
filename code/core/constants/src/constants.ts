import { useEffect, useLayoutEffect } from 'react'

export const isWeb: boolean = true
// check document not window — RN polyfills global.window but not document,
// so this is the only reliable "is DOM environment" check.
export const isBrowser: boolean = typeof document !== 'undefined'
export const isServer: boolean = isWeb && !isBrowser
export const isClient: boolean = isWeb && isBrowser
/** @deprecated use isBrowser instead */
export const isWindowDefined: boolean = isBrowser

export const useIsomorphicLayoutEffect: typeof useEffect = isServer
  ? useEffect
  : useLayoutEffect

export const isChrome: boolean =
  typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')

export const isWebTouchable: boolean =
  isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export const isTouchable: boolean = !isWeb || isWebTouchable
// set :boolean to avoid inferring type to false
// On web, isAndroid/isIos are always false in production.
// TEST_NATIVE_PLATFORM is only set by the test runner (vitest) to simulate native
// environments (e.g. androidtv, tvos) from a web/jsdom test context.
export const isAndroid: boolean =
  process.env.TEST_NATIVE_PLATFORM === 'android' ||
  // Android TV has Platform.OS === 'android' per react-native-tvos
  process.env.TEST_NATIVE_PLATFORM === 'androidtv'
export const isIos: boolean =
  process.env.TEST_NATIVE_PLATFORM === 'ios' ||
  // tvOS has Platform.OS === 'ios' per react-native-tvos
  process.env.TEST_NATIVE_PLATFORM === 'tvos'
export const isTV: boolean =
  process.env.TEST_NATIVE_PLATFORM === 'androidtv' ||
  process.env.TEST_NATIVE_PLATFORM === 'tvos'
/**
 * Reflects Platform.OS. TV platforms are intentionally NOT separate values:
 * - Android TV has Platform.OS === 'android' (react-native-tvos behavior)
 * - tvOS has Platform.OS === 'ios' (react-native-tvos behavior)
 * Use `isTV` combined with `isAndroid`/`isIos` to detect specific TV platforms.
 */
export const currentPlatform: 'web' | 'ios' | 'native' | 'android' = 'web'

// In web source mode (Vite/webpack without pre-built dist), TAMAGUI_TARGET may not be set.
// Set it here so all process.env.TAMAGUI_TARGET runtime checks work correctly.
// In pre-built dist, the build tool inlines TAMAGUI_TARGET as a literal string,
// making this block dead code (if (!'web') → never executes).
if (!process.env.TAMAGUI_TARGET) {
  process.env.TAMAGUI_TARGET = 'web'
}
