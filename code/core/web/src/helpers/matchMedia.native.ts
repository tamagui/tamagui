import type { MatchMedia, MediaQueryList } from '../types'
import { formatDiagnostic } from './formatDiagnostic'
import { mediaObjectToString } from './mediaObjectToString'
import { mediaQueryConfig } from './mediaState'

let matchMediaImpl: MatchMedia = matchMediaFallback

export const matchMedia: MatchMedia = (...args) => matchMediaImpl(...args)

function matchMediaFallback(query: string): MediaQueryList {
  if (!process.env.IS_STATIC && process.env.NODE_ENV === 'development') {
    const keys = Object.keys(mediaQueryConfig).filter(
      (key) => mediaObjectToString(mediaQueryConfig[key]) === query
    )
    console.warn(
      formatDiagnostic(
        'TAMAGUI_MATCH_MEDIA_NATIVE',
        'matchMedia',
        'no native matchMedia implementation is installed',
        'Call setupMatchMedia before configuring media queries',
        'keys,query',
        { keys, query }
      )
    )
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
