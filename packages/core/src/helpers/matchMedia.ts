import { MatchMedia, MediaQueryList } from '../types'

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
