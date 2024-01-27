import type { MatchMedia, MediaQueryList } from '../types'

export const matchMedia =
  (typeof window !== 'undefined' && window.matchMedia) || matchMediaFallback

function matchMediaFallback(_: string): MediaQueryList {
  return {
    match: (a, b) => false,
    addListener() {},
    removeListener() {},
    matches: false,
  }
}

export function setupMatchMedia(_: MatchMedia) {
  // no-op web
}
