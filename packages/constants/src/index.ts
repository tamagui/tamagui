import { useEffect, useLayoutEffect } from 'react'

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
export const useIsomorphicLayoutEffect = isRSC
  ? idFn
  : isServer
  ? useEffect
  : useLayoutEffect
export const isChrome =
  typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent || '')

export const isWebTouchable =
  isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export const isTouchable = !isWeb || isWebTouchable

if (process.env.NODE_ENV === 'development') {
  if (!process.env.TAMAGUI_TARGET) {
    // eslint-disable-next-line no-console
    console.warn(`Must set TAMAGUI_TARGET to "web" or "native"`)
  } else if (
    isClient &&
    process.env.TAMAGUI_TARGET !== 'web' &&
    process.env.TAMAGUI_IGNORE_TARGET !== '1'
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `Must set TAMAGUI_TARGET to "web" for web apps - if you have window defined outside of the browser, set TAMAGUI_IGNORE_TARGET=1 to hide this`
    )
  }
}
