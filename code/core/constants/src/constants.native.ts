import { useLayoutEffect, type useEffect } from 'react'
import { Platform } from 'react-native'

export const isWeb: boolean = false
export const isWindowDefined: boolean = false
export const isServer: boolean = false
export const isClient: boolean = false
export const useIsomorphicLayoutEffect: typeof useEffect = useLayoutEffect
export const isChrome: boolean = false
export const isWebTouchable: boolean = false
export const isTouchable: boolean = true
export const isAndroid: boolean =
  Platform.OS === 'android' || process.env.TEST_NATIVE_PLATFORM === 'android'
export const isIos: boolean =
  Platform.OS === 'ios' || process.env.TEST_NATIVE_PLATFORM === 'ios'

const platforms = { ios: 'ios', android: 'android' } as const
export const currentPlatform: 'web' | 'ios' | 'native' | 'android' =
  platforms[Platform.OS] || 'native'
