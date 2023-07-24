import { useEffect, useLayoutEffect } from 'react'

export const isWeb = process.env.TAMAGUI_TARGET === 'web'
export const isWindowDefined = typeof window !== 'undefined'
export const isServer = isWeb && !isWindowDefined
export const isClient = isWeb && isWindowDefined

export const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect
export const isChrome =
  typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')

export const isWebTouchable =
  isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export const isTouchable = !isWeb || isWebTouchable
// set :boolean to avoid inferring type to false
export const isAndroid: boolean = false
export const isIos: boolean = false
export const currentPlatform = 'web'

// --- development warnings ---

if (!process.env.TAMAGUI_TARGET) {
  console.warn(`⚠️ Must set TAMAGUI_TARGET (set TAMAGUI_SHOW_TRACE=1 to see trace)`)
  if (process.env.TAMAGUI_SHOW_TRACE) {
    console.trace()
  }
}

if (process.env.NODE_ENV === 'development') {
  if (
    isClient &&
    process.env.TAMAGUI_TARGET !== 'web' &&
    process.env.TAMAGUI_IGNORE_TARGET !== '1'
  ) {
    console.warn(
      `Must set TAMAGUI_TARGET to "web" for web apps - if you have window defined outside of the browser, set TAMAGUI_IGNORE_TARGET=1 to hide this`
    )
  }
}
