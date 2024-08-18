import { createAnimations } from '@tamagui/animations-css'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { createTamagui } from 'tamagui'
import { themes as themesIn } from './themes'
import { shorthands } from '@tamagui/shorthands/v2'
import { tokens } from './tokens'

export const smoothBezier = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'

export const cssTransitions = {
  '75ms': 'ease-in 75ms',
  '100ms': 'ease-in 100ms',
  '200ms': 'ease-in 200ms',
  bouncy: 'ease-in 200ms',
  superBouncy: 'ease-in 500ms',
  lazy: 'ease-in 1000ms',
  medium: 'ease-in 300ms',
  slow: 'ease-in 500ms',
  quick: `${smoothBezier} 400ms`,
  quicker: `${smoothBezier} 300ms`,
  quickest: `${smoothBezier} 200ms`,
  tooltip: 'ease-in 400ms',
}

export const animations = createAnimations(cssTransitions)

export const selectionStyles = (theme) =>
  theme.color5
    ? {
        backgroundColor: theme.color5,
        color: theme.color11,
      }
    : null

// tree shake away themes in production
const themes =
  process.env.TAMAGUI_OPTIMIZE_THEMES === 'true' ? ({} as typeof themesIn) : themesIn

const media = createMedia({
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

const headingFont = createInterFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 44,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: '$colorFocus',
      7: '$color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: -1,
      10: -1.5,
      12: -2,
      14: -3,
      15: -4,
    },
    // for native
    face: {
      700: { normal: 'InterBold' },
      800: { normal: 'InterBold' },
      900: { normal: 'InterBold' },
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

const bodyFont = createInterFont(
  {
    weight: {
      1: '400',
      7: '600',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size >= 12 ? 8 : 4)),
  }
)

export const config = createTamagui({
  animations,
  themes,
  media,
  tokens,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  selectionStyles,
  shorthands,
  settings: {
    mediaQueryDefaultActive: {
      xl: true,
      lg: true,
      md: true,
      sm: true,
      xs: true,
      // false
      xxs: false,
    },
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: false,
    themeClassNameOnRoot: false,
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card'
  }
}

export default config
