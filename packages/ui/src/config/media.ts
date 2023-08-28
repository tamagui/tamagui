import { createMedia } from '@tamagui/react-native-media-driver'

export const media = createMedia({
  xxs: { maxWidth: 390 },
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1650 },

  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  gtXl: { minWidth: 1650 + 1 },
})

// note all the non "gt" ones should be true to start to match mobile-first
// we're aiming for "xs" to be the default to "gtXs" true too
export const mediaQueryDefaultActive = {
  xxs: false,
  xs: true,
  sm: true,
  md: true,
  lg: true,
  xl: true,

  gtXs: false,
  gtSm: false,
  gtMd: false,
  gtLg: false,
  gtXl: false,
}
