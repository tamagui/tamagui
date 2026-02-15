// note order is important!
// earlier defined = less important

export const breakpoints = {
  xxxs: 260,
  xxs: 340,
  xs: 460,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
}

const mediaQueryForceNonOverlap = process.env.TAMAGUI_TARGET === 'native' ? 1 : 0.02

export const media = {
  // always true on native
  touchable:
    process.env.TAMAGUI_TARGET === 'native'
      ? ({ minWidth: 0 } as never)
      : { pointer: 'coarse' },

  // always false on native (can't hover on touch)
  hoverable:
    process.env.TAMAGUI_TARGET === 'native'
      ? ({ maxWidth: 0 } as never)
      : { hover: 'hover' },

  // Max-width queries (desktop-first, ordered large-to-small so smaller wins)
  'max-xxl': { maxWidth: breakpoints.xxl - mediaQueryForceNonOverlap },
  'max-xl': { maxWidth: breakpoints.xl - mediaQueryForceNonOverlap },
  'max-lg': { maxWidth: breakpoints.lg - mediaQueryForceNonOverlap },
  'max-md': { maxWidth: breakpoints.md - mediaQueryForceNonOverlap },
  'max-sm': { maxWidth: breakpoints.sm - mediaQueryForceNonOverlap },
  'max-xs': { maxWidth: breakpoints.xs - mediaQueryForceNonOverlap },
  'max-xxs': { maxWidth: breakpoints.xxs - mediaQueryForceNonOverlap },
  'max-xxxs': { maxWidth: breakpoints.xxxs - mediaQueryForceNonOverlap },

  // Min-width queries (mobile-first)
  // non-max wins over max though tbh it could go either way
  xxxs: { minWidth: breakpoints.xxxs },
  xxs: { minWidth: breakpoints.xxs },
  xs: { minWidth: breakpoints.xs },
  sm: { minWidth: breakpoints.sm },
  md: { minWidth: breakpoints.md },
  lg: { minWidth: breakpoints.lg },
  xl: { minWidth: breakpoints.xl },
  xxl: { minWidth: breakpoints.xxl },

  // Height-based queries LAST so they override width queries when both match
  // (later in object = higher CSS specificity)
  // max-height ordered large-to-small so smaller wins (like max-width)
  'max-height-lg': { maxHeight: breakpoints.lg - mediaQueryForceNonOverlap },
  'max-height-md': { maxHeight: breakpoints.md - mediaQueryForceNonOverlap },
  'max-height-sm': { maxHeight: breakpoints.sm - mediaQueryForceNonOverlap },

  'height-sm': { minHeight: breakpoints.sm },
  'height-md': { minHeight: breakpoints.md },
  'height-lg': { minHeight: breakpoints.lg },
} as const

export const mediaQueryDefaultActive = {
  touchable: process.env.TAMAGUI_TARGET === 'native',
  hoverable: process.env.TAMAGUI_TARGET !== 'native',
  // Max queries
  'max-xxl': true,
  'max-xl': true,
  'max-lg': true,
  'max-md': true,
  'max-sm': true,
  'max-xs': true,
  'max-xxs': false,
  'max-xxxs': false,
  // Min queries
  xxxs: true,
  xxs: true,
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
  // Height queries (default: iPhone non-max ~844pt)
  'max-height-sm': false,
  'max-height-md': false,
  'max-height-lg': true,
  'height-sm': true,
  'height-md': true,
  'height-lg': false,
}
