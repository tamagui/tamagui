const isResponsiveDemo = typeof window !== 'undefined' && location.pathname === '/demo-responsive'

export const demoMedia = [475, 620, 780, 950, 1200]

export const media = {
  xs: { maxWidth: isResponsiveDemo ? demoMedia[0] : 660 },
  sm: { maxWidth: isResponsiveDemo ? demoMedia[1] : 800 },
  md: { maxWidth: isResponsiveDemo ? demoMedia[2] : 1020 },
  lg: { maxWidth: isResponsiveDemo ? demoMedia[3] : 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
}
