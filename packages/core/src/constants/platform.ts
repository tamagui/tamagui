import { useEffect, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

export const isWeb = process.env.TAMAGUI_TARGET === 'web' ? true : Platform?.OS === 'web'
export const isSSR = isWeb && typeof window === 'undefined'
export const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect
export const isChrome = typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')
export const supportsTouchWeb = typeof window !== 'undefined' && 'ontouchstart' in window
export const isTouchDevice = !isWeb || supportsTouchWeb
export const isWebIOS =
  isWeb &&
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window['MSStream']
