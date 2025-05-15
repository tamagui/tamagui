export const demoMedia = [500, 620, 780, 900]
export const widths = [660, 800, 1020, 1280]

// note order is important!
// earlier defined = less important

// v4 Config
const breakpoints = {
  '2xl': 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
  xs: 460,
  '2xs': 340,
}

export const media = {
  // v4 Config
  maxXs: { maxWidth: breakpoints.xs },
  max2xs: { maxWidth: breakpoints['2xs'] },
  maxSm: { maxWidth: breakpoints.sm },
  maxMd: { maxWidth: breakpoints.md },
  maxLg: { maxWidth: breakpoints.lg },
  maxXl: { maxWidth: breakpoints.xl },
  max2Xl: { maxWidth: breakpoints['2xl'] },
  // for site
  xl: { maxWidth: 1650 },
  // between lg and xl - for studio usage
  lg_xl: { maxWidth: 1400 },
  lg: { maxWidth: 1280 },
  md: { maxWidth: 1020 },
  sm: { maxWidth: 800 },
  xs: { maxWidth: 660 },
  xxs: { maxWidth: 390 },
  gtXxs: { minWidth: 390 + 1 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  gtXl: { minWidth: 1650 + 1 },
  pointerFine: { pointer: 'fine' },
} as const

// note all the non "gt" ones should be true to start to match mobile-first
// were aiming for "xs" to be the default to "gtXs" true too
export const mediaQueryDefaultActive = {
  xl: true,
  lg: true,
  md: true,
  sm: true,
  xs: true,
  // false
  xxs: false,
}
