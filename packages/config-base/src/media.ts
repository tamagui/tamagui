import { createMedia } from '@tamagui/react-native-media-driver'

export const demoMedia = [500, 620, 780, 900]
export const widths = [660, 800, 1020, 1280]

export const media = createMedia({
  // for site
  xl: { maxWidth: 1650 },
  lg: { maxWidth: 1280 },
  md: { maxWidth: 1020 },
  sm: { maxWidth: 800 },
  xs: { maxWidth: 660 },
  xxs: { maxWidth: 390 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  gtXl: { minWidth: 1650 + 1 },
})
