// note order is important!
// earlier defined = less important

export const breakpoints = {
  // for container queries its really helpful to have small sizes
  100: 100,
  200: 200,

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
  touchable:
    process.env.TAMAGUI_TARGET === 'native'
      ? ({ minWidth: 0 } as never)
      : { pointer: 'coarse' },

  hoverable:
    process.env.TAMAGUI_TARGET === 'native'
      ? ({ maxWidth: 0 } as never)
      : { hover: 'hover' },

  'max-xxl': { maxWidth: breakpoints.xxl - mediaQueryForceNonOverlap },
  'max-xl': { maxWidth: breakpoints.xl - mediaQueryForceNonOverlap },
  'max-lg': { maxWidth: breakpoints.lg - mediaQueryForceNonOverlap },
  'max-md': { maxWidth: breakpoints.md - mediaQueryForceNonOverlap },
  'max-sm': { maxWidth: breakpoints.sm - mediaQueryForceNonOverlap },
  'max-xs': { maxWidth: breakpoints.xs - mediaQueryForceNonOverlap },
  'max-xxs': { maxWidth: breakpoints.xxs - mediaQueryForceNonOverlap },
  'max-xxxs': { maxWidth: breakpoints.xxxs - mediaQueryForceNonOverlap },

  'max-200': { maxWidth: breakpoints['200'] - mediaQueryForceNonOverlap },
  'max-100': { maxWidth: breakpoints['100'] - mediaQueryForceNonOverlap },

  xxxs: { minWidth: breakpoints.xxxs },
  xxs: { minWidth: breakpoints.xxs },
  xs: { minWidth: breakpoints.xs },
  sm: { minWidth: breakpoints.sm },
  md: { minWidth: breakpoints.md },
  lg: { minWidth: breakpoints.lg },
  xl: { minWidth: breakpoints.xl },
  xxl: { minWidth: breakpoints.xxl },

  'max-height-lg': { maxHeight: breakpoints.lg - mediaQueryForceNonOverlap },
  'max-height-md': { maxHeight: breakpoints.md - mediaQueryForceNonOverlap },
  'max-height-sm': { maxHeight: breakpoints.sm - mediaQueryForceNonOverlap },
  'max-height-xs': { maxHeight: breakpoints.xs - mediaQueryForceNonOverlap },
  'max-height-xxs': { maxHeight: breakpoints.xxs - mediaQueryForceNonOverlap },
  'max-height-xxxs': { maxHeight: breakpoints.xxxs - mediaQueryForceNonOverlap },

  'max-height-200': { maxHeight: breakpoints['200'] - mediaQueryForceNonOverlap },
  'max-height-100': { maxHeight: breakpoints['100'] - mediaQueryForceNonOverlap },

  'height-sm': { minHeight: breakpoints.sm },
  'height-md': { minHeight: breakpoints.md },
  'height-lg': { minHeight: breakpoints.lg },
} as const

export type V6Media = typeof media

export const mediaQueryDefaultActive = {
  touchable: process.env.TAMAGUI_TARGET === 'native',
  hoverable: process.env.TAMAGUI_TARGET !== 'native',
  'max-xxl': true,
  'max-xl': true,
  'max-lg': true,
  'max-md': true,
  'max-sm': true,
  'max-xs': true,
  'max-xxs': false,
  'max-xxxs': false,
  xxxs: true,
  xxs: true,
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
  'max-height-sm': false,
  'max-height-md': false,
  'max-height-lg': true,
  'height-sm': true,
  'height-md': true,
  'height-lg': false,
}
