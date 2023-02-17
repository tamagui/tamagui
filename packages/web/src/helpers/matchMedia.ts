import { MatchMedia, MediaQueryList } from '../types.js'

export const matchMedia =
  (typeof window !== 'undefined' && window.matchMedia) || matchMediaFallback

function matchMediaFallback(_: string): MediaQueryList {
  return {
    addListener() {},
    removeListener() {},
    matches: false,
  }
}

export function setupMatchMedia(_: MatchMedia) {
  // no-op web
}
