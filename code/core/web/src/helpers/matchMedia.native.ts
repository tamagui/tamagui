
import type { MatchMedia, MediaQueryList } from '../types'

let matchMediaImpl: MatchMedia = matchMediaFallback

export const matchMedia: MatchMedia = (...args) => matchMediaImpl(...args)

function matchMediaFallback(query: string): MediaQueryList {
  if (!process.env.IS_STATIC && process.env.NODE_ENV === 'development') {
    console.warn('warning: matchMedia implementation is not provided.')
  }
  return {
    match: (a, b) => false,
    addListener: () => {},
    removeListener: () => {},
    matches: false,
  }
}

export function setupMatchMedia(_: MatchMedia) {
  if (typeof _ !== 'function') {
    if (process.env.NODE_ENV === 'development' && !process.env.IS_STATIC) {
      console.trace(
        `setupMatchMedia was called without a function, this can cause issues on native`,
        _
      )
    }
    return
  }

  matchMediaImpl = _
  // On native, globalThis === window.  Assigning here makes window.matchMedia available
  // to any code that calls it directly (e.g. third-party packages, RN internals) rather
  // than going through Tamagui's re-exported `matchMedia` helper.  Without this, those
  // callers get "window.matchMedia is not a function (it is undefined)".
  // @ts-ignore
  globalThis['matchMedia'] = _
}
