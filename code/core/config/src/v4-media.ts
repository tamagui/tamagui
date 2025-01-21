// note order is important!
// earlier defined = less important

export const breakpoints = {
  '2xl': 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
  xs: 460,
  '2xs': 340,
}

export const media = {
  // for site
  '2xl': { minWidth: breakpoints['2xl'] },
  xl: { minWidth: breakpoints.xl },
  lg: { minWidth: breakpoints.lg },
  md: { minWidth: breakpoints.md },
  sm: { minWidth: breakpoints.sm },
  xs: { minWidth: breakpoints.xs },
  '2xs': { minWidth: breakpoints['2xs'] },
} as const

export const mediaQueryDefaultActive = {
  '2xl': false,
  xl: false,
  lg: false,
  md: false,
  sm: false,
  xs: true,
  '2xs': true,
}
