export const matchMedia =
  (typeof window !== 'undefined' && window.matchMedia) ||
  (function matchMediaFallback(query: string) {
    return {
      addListener() {},
      removeListener() {},
      matches: false,
    }
  } as any)
