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
  // Note: the previous `globalThis['matchMedia'] = _` assignment was removed.
  // On Android TV / tvOS, globalThis === window. Assigning to globalThis['matchMedia']
  // polluted window.matchMedia on those platforms, which caused issues.
  // The web matchMedia.ts uses `(typeof window !== 'undefined' && window.matchMedia)`
  // directly — that's correct on web. On native, this .native.ts file is used and
  // matchMediaImpl holds the native implementation; no globalThis assignment is needed.
}
