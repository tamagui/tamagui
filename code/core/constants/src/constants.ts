import React from 'react'

export const isWeb: boolean = true
export const isWindowDefined = typeof window !== 'undefined'
export const isServer = isWeb && !isWindowDefined
export const isClient = isWeb && isWindowDefined

export const useIsomorphicLayoutEffect = isServer
  ? React.useEffect
  : React.useLayoutEffect
export const isChrome =
  typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')

export const isWebTouchable =
  isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export const isTouchable = !isWeb || isWebTouchable
// set :boolean to avoid inferring type to false
export const isAndroid: boolean = false
export const isIos: boolean = process.env.TEST_NATIVE_PLATFORM === 'ios'
export const currentPlatform: 'web' | 'ios' | 'native' | 'android' = 'web'
