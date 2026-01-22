import { useEffect, useLayoutEffect } from 'react'

export const isWeb: boolean = true
export const isWindowDefined: boolean = typeof window !== 'undefined'
export const isServer: boolean = isWeb && !isWindowDefined
export const isClient: boolean = isWeb && isWindowDefined

export const useIsomorphicLayoutEffect: typeof useEffect = isServer
  ? useEffect
  : useLayoutEffect

export const isChrome: boolean =
  typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')

export const isWebTouchable: boolean =
  isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export const isTouchable: boolean = !isWeb || isWebTouchable
// set :boolean to avoid inferring type to false
export const isAndroid: boolean = false
export const isIos: boolean = process.env.TEST_NATIVE_PLATFORM === 'ios'
export const currentPlatform: 'web' | 'ios' | 'native' | 'android' = 'web'
