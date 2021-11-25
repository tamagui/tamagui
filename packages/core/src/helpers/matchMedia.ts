export const matchMedia =
  (typeof window !== 'undefined' && window.matchMedia) ||
  (function matchMediaFallback(query: string) {
    return {
      addListener() {
        if (process.env.NODE_ENV === 'development') {
          console.log('warning: matchMedia not loading! Is native picking up .native.js files?')
        }
      },
      removeListener() {},
      matches: false,
    }
  } as any)
