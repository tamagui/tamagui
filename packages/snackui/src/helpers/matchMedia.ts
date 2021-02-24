export const matchMedia =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia
    : function matchMediaFallback() {
        return {
          addEventListener() {},
          removeEventListener() {},
          matches: false,
        }
      }
