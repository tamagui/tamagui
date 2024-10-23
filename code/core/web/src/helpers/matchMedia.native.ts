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
  if (process.env.NODE_ENV === 'development') {
    if (typeof _ !== 'function') {
      if (!process.env.IS_STATIC) {
        console.trace(
          `setupMatchMedia was called without a function, this can cause issues on native`,
          _
        )
      }
    }
  }

  matchMediaImpl = _
  // @ts-ignore
  globalThis['matchMedia'] = _
}
