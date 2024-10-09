import { createFont, createTokens } from '@tamagui/core'
import { shorthands } from '@tamagui/shorthands'
// import { animations } from './animations'
// import { animations as animationsNative } from './animations.native'

// basic fallback theme just to have compiler load in decent tate
export function getDefaultTamaguiConfig(platform: 'native' | 'web' = 'web') {
  const headingFont = createFont({
    family: 'Heading',
    size: {
      1: 15,
    },
    lineHeight: {
      1: 15,
    },
    transform: {},
    weight: {
      1: '400',
    },
    color: {
      1: '$color',
    },
    letterSpacing: {
      1: 0,
    },
  })

  const font = createFont({
    family: 'System',
    size: {
      1: 15,
    },
    lineHeight: {
      1: 15,
    },
    transform: {},
    weight: {
      1: '400',
    },
    color: {
      1: '$color',
    },
    letterSpacing: {
      1: 0,
    },
  })

  const size = {
    0: 0,
    0.25: 2,
    0.5: 4,
    0.75: 8,
    1: 20,
    1.5: 24,
    2: 28,
    2.5: 32,
    3: 36,
    3.5: 40,
    4: 44,
    true: 44,
    4.5: 48,
    5: 52,
    5.5: 59,
    6: 64,
    6.5: 69,
    7: 74,
    7.6: 79,
    8: 84,
    8.5: 89,
    9: 94,
    9.5: 99,
    10: 104,
    11: 124,
    12: 144,
    13: 164,
    14: 184,
    15: 204,
    16: 224,
    17: 224,
    18: 244,
    19: 264,
    20: 284,
  }

  const spaces = Object.entries(size).map(
    ([k, v]) =>
      [
        k,
        Math.max(0, v <= 16 ? Math.round(v * 0.333) : Math.floor(v * 0.7 - 12)),
      ] as const
  )

  const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k}`, -v])

  const space = {
    ...Object.fromEntries(spaces),
    ...Object.fromEntries(spacesNegative),
  } as any

  const zIndex = {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  }

  const radius = {
    0: 0,
    1: 3,
    2: 5,
    3: 7,
    4: 9,
    5: 10,
    6: 16,
    7: 19,
    8: 22,
    9: 26,
    10: 34,
    11: 42,
    12: 50,
  }

  const tokens = createTokens({
    color: {
      white: '#fff',
      black: '#000',
    },
    radius,
    zIndex,
    space,
    size,
  })

  const themes = {
    light: {
      background: tokens.color.white,
      color: tokens.color.black,
    },
    dark: {
      background: tokens.color.black,
      color: tokens.color.white,
    },
    // most of these used for testing:
    dark_blue: {
      background: 'blue',
      color: 'white',
    },
    dark_Card: {
      background: 'dark',
      color: 'card',
    },
    dark_Button: {
      background: 'dark',
      color: 'button',
    },
    dark_blue_Button: {
      background: 'blue',
      color: 'white',
    },
    dark_red: {
      background: 'darkred',
      color: 'white',
    },
    dark_red_alt1: {
      background: 'darkred',
      color: 'white',
    },
    dark_red_Button: {
      background: 'darkred',
      color: '#ccc',
    },
    dark_yellow_Button: {
      background: 'brown',
      color: '#ccc',
    },
    dark_red_active_ListItem: {
      background: 'darkred',
      color: 'red',
    },
    dark_red_alt2: {
      background: 'darkred',
      color: '#555',
    },
    dark_red_alt2_Button: {
      background: 'darkred',
      color: '#444',
    },
    red: {
      background: 'red',
      color: 'red',
    },
  }

  const fonts = {
    heading: headingFont,
    body: font,
  }

  const media = {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
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

  return {
    // animations: platform === 'web' ? animations : animationsNative,
    shorthands,
    fonts,
    themes,
    tokens,
    media,
    settings: {
      shouldAddPrefersColorThemes: true,
      defaultFont: 'body',
      themeClassNameOnRoot: true,
    },
  }
}
