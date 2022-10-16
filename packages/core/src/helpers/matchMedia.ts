export const matchMedia = (typeof window !== 'undefined' && window.matchMedia) || matchMediaFallback

function matchMediaFallback(query: string): MediaQueryList {
  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.IS_STATIC &&
    process.env.TAMAGUI_TARGET !== 'web'
  ) {
    // eslint-disable-next-line no-console
    console.log('warning: matchMedia not loading! Native not picking up .native.js files?')
  }
  return {
    addListener() {},
    removeListener() {},
    matches: false,
  } as any
}
