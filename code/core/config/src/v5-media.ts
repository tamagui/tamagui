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

  // Height-based queries
  heightXXXS: { minHeight: breakpoints.xxxs },
  heightXXS: { minHeight: breakpoints.xxs },
  heightXS: { minHeight: breakpoints.xs },
  heightSM: { minHeight: breakpoints.sm },
  heightMD: { minHeight: breakpoints.md },
  heightLG: { minHeight: breakpoints.lg },

  // Max-width queries (desktop-first)
  maxXXXS: { maxWidth: breakpoints.xxxs },
  maxXXS: { maxWidth: breakpoints.xxs },
  maxXS: { maxWidth: breakpoints.xs },
  maxSM: { maxWidth: breakpoints.sm },
  maxMD: { maxWidth: breakpoints.md },
  maxLG: { maxWidth: breakpoints.lg },
  maxXL: { maxWidth: breakpoints.xl },
  maxXXL: { maxWidth: breakpoints.xxl },

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
  heightXXXS: true,
  heightXXS: true,
  heightXS: true,
  heightSM: false,
  heightMD: false,
  heightLG: false,
  // Max queries
  maxXXXS: false,
  maxXXS: false,
  maxXS: true,
  maxSM: true,
  maxMD: true,
  maxLG: true,
  maxXL: true,
  maxXXL: true,
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
