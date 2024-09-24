import { createTamagui, createFont } from '@tamagui/web'

const body = createFont({
  family: 'Inter',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
    7: 48,
    8: 64,
  },
})

const customConfig = {
  settings: {
    defaultFont: 'body',
  },
  fonts: {
    body,
  },
  themes: {
    light: {
      background: '#fecc1b',
      color: '#131313',
    },
    dark: {
      background: '#121212',
      color: '#d83bd2',
    },
  },
  media: {
    smallScreen: { minWidth: 600 },
    mediumScreen: { minWidth: 768 },
    largeScreen: { minWidth: 1024 },
    extraLargeScreen: { minWidth: 1280 },
    extraExtraLargeScreen: { minWidth: 1440 },
    ultraWideScreen: { minWidth: 1920 },
  },
  tokens: {
    color: {
      primary: '#bada55',
      secondary: '#ffa500',
    },
    size: {
      small: 8,
      medium: 16,
      large: 32,
    },
    space: {
      small: 4,
      medium: 8,
      large: 16,
    },
    radius: {
      small: 2,
      medium: 4,
      large: 8,
    },
    zIndex: {
      low: 1,
      medium: 10,
      high: 100,
    },
  },
}

const tamaguiConfig = createTamagui(customConfig)

export type TamaguiConfig = typeof tamaguiConfig

export default tamaguiConfig
