import type { MatchMedia, MediaQueryList } from '../types'

let matchMediaImpl: MatchMedia = matchMediaFallback

export const matchMedia: MatchMedia = (...args) => matchMediaImpl(...args)

function matchMediaFallback(query: string): MediaQueryList {
  if (process.env.NODE_ENV === 'development') {
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
  matchMediaImpl = _
  // @ts-ignore
  globalThis['matchMedia'] = _
}
