import { useEffect, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

export const isAndroid = Platform?.OS === 'android'
export const isIOS = Platform?.OS === 'ios'
export const isWeb = process.env.TAMAGUI_TARGET === 'web'
export const isWindowDefined = typeof window !== 'undefined'
export const isSSR = isWeb && !isWindowDefined
export const isClient = isWeb && isWindowDefined

// @ts-ignore
const isRSC = process.env.ENABLE_RSC ? import.meta.env.SSR : false
const idFn = () => {}

export const useIsomorphicLayoutEffect = isRSC ? idFn : isSSR ? useEffect : useLayoutEffect
export const isChrome = typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')
export const isWebTouchable = isClient && 'ontouchstart' in window
export const isTouchable = !isWeb || isWebTouchable
