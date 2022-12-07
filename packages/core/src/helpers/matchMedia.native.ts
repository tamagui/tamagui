import { MatchMedia, MediaQueryList } from "../types"

export let matchMedia: MatchMedia;

setupMatchMedia(matchMediaFallback);

function matchMediaFallback(query: string): MediaQueryList {
  if (
    process.env.NODE_ENV === 'development'
  ) {
    // eslint-disable-next-line no-console
    console.warn('warning: matchMedia implementation is not provided.')
  }
  return {
    addListener() {},
    removeListener() {},
    matches: false,
  }
}

export function setupMatchMedia(nativeMatchMedia: (media: string) => MediaQueryList) {
  matchMedia = nativeMatchMedia;
  // @ts-ignore
  globalThis['matchMedia'] = matchMedia
}