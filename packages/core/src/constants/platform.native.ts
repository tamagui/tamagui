import { useLayoutEffect } from 'react'
import { Platform } from 'react-native'

export const isAndroid = Platform?.OS === 'android'
export const isIOS = Platform?.OS === 'ios'
export const isWeb = false
export const isWindowDefined = false
export const isSSR = false
export const isClient = false
export const isRSC = false
export const useIsomorphicLayoutEffect = useLayoutEffect
export const isChrome = false
export const isWebTouchable = false
export const isTouchable = true
