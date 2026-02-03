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

export const media = {
  pointerTouch: { pointer: 'coarse' },

  // Height-based queries (min-height, mobile-first)
  'height-xxxs': { minHeight: breakpoints.xxxs },
  'height-xxs': { minHeight: breakpoints.xxs },
  'height-xs': { minHeight: breakpoints.xs },
  'height-sm': { minHeight: breakpoints.sm },
  'height-md': { minHeight: breakpoints.md },
  'height-lg': { minHeight: breakpoints.lg },

  // Max-width queries (desktop-first, ordered large-to-small so smaller wins)
  'max-xxl': { maxWidth: breakpoints.xxl },
  'max-xl': { maxWidth: breakpoints.xl },
  'max-lg': { maxWidth: breakpoints.lg },
  'max-md': { maxWidth: breakpoints.md },
  'max-sm': { maxWidth: breakpoints.sm },
  'max-xs': { maxWidth: breakpoints.xs },
  'max-xxs': { maxWidth: breakpoints.xxs },
  'max-xxxs': { maxWidth: breakpoints.xxxs },

  // Min-width queries (mobile-first)
  xxxs: { minWidth: breakpoints.xxxs },
  xxs: { minWidth: breakpoints.xxs },
  xs: { minWidth: breakpoints.xs },
  sm: { minWidth: breakpoints.sm },
  md: { minWidth: breakpoints.md },
  lg: { minWidth: breakpoints.lg },
  xl: { minWidth: breakpoints.xl },
  xxl: { minWidth: breakpoints.xxl },
} as const

export const mediaQueryDefaultActive = {
  pointerTouch: false,
  // Height queries
  'height-xxxs': true,
  'height-xxs': true,
  'height-xs': true,
  'height-sm': false,
  'height-md': false,
  'height-lg': false,
  // Max queries (ordered large-to-small to match media object)
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
}
