import React from 'react'

export const isWeb: boolean = false
export const isWindowDefined: boolean = false
export const isServer: boolean = false
export const isClient: boolean = false
export const useIsomorphicLayoutEffect = React.useLayoutEffect
export const isChrome: boolean = false
export const isWebTouchable: boolean = false
export const isTouchable: boolean = true
export const isAndroid: boolean = false
export const isIos: boolean = process.env.TEST_NATIVE_PLATFORM === 'ios'
export const currentPlatform: 'web' | 'ios' | 'native' | 'android' = 'native'
