import { useEffect, useLayoutEffect } from 'react'

export const isWeb: boolean = true
export const isBrowser: boolean = typeof window !== 'undefined'
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
