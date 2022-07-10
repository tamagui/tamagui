import { useEffect, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

export const isAndroid = Platform?.OS === 'android'
export const isIOS = Platform?.OS === 'ios'
export const isWeb = process.env.TAMAGUI_TARGET === 'web'
export const isSSR = isWeb && typeof window === 'undefined'
export const isClient = isWeb && typeof window !== 'undefined'
export const useIsomorphicLayoutEffect = !isWeb || isClient ? useLayoutEffect : useEffect
export const isChrome = typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')
export const isWebTouchable = typeof window !== 'undefined' && 'ontouchstart' in window
export const isTouchable = !isWeb || isWebTouchable
export const isWebIOS =
  isWeb &&
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window['MSStream']
