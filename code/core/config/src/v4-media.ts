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
  '2xl': { maxWidth: breakpoints['2xl'] },
  xl: { maxWidth: breakpoints.xl },
  lg: { maxWidth: breakpoints.lg },
  md: { maxWidth: breakpoints.md },
  sm: { maxWidth: breakpoints.sm },
  xs: { maxWidth: breakpoints.xs },
  '2xs': { maxWidth: breakpoints['2xs'] },
} as const

// all true to start to match mobile-first
export const mediaQueryDefaultActive = {
  '2xl': true,
  xl: true,
  lg: true,
  md: true,
  sm: true,
  xs: true,
  '2xs': true,
}
