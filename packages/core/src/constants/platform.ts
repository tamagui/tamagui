import { useEffect, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

export const isAndroid = Platform?.OS === 'android'
export const isIOS = Platform?.OS === 'ios'
export const isWeb = process.env.TAMAGUI_TARGET === 'web'
export const isWindowDefined = typeof window !== 'undefined'
export const isServer = isWeb && !isWindowDefined
export const isClient = isWeb && isWindowDefined

// may want to move to VITE_RSC_BUILD
export const isRSC = process.env.ENABLE_RSC
  ? // note this is statically analyzed so no funny business, just access it without optional chaining
    // @ts-ignore
    import.meta.env
    ? // @ts-ignore
      import.meta.env.SSR
    : false
  : false

const idFn = () => {}
export const useIsomorphicLayoutEffect = isRSC ? idFn : isServer ? useEffect : useLayoutEffect
export const isChrome = typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')
export const isWebTouchable = isClient && 'ontouchstart' in window
export const isTouchable = !isWeb || isWebTouchable
