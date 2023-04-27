import { createTamagui, createTokens } from '@tamagui/core'
import { createThemes } from '@tamagui/create-themes'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'
import {
  amber,
  amberDark,
  cyan,
  cyanDark,
  indigo,
  indigoDark,
  mint,
  mintDark,
  sky,
  skyDark,
  slate,
  slateDark,
  teal,
  tealDark,
} from '@tamagui/themes'
import { color, radius, size, space, zIndex } from '@tamagui/themes'
import { colorTokens } from '@tamagui/themes'

import { animations } from './animations'

const headingFont = createInterFont({
  size: {
    6: 15,
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
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    700: { normal: 'InterBold' },
  },
})

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: 'InterBold' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
)

const tokens = createTokens({
  color,
  space,
  size,
  radius,
  zIndex,
})

const colorsLight = {
  ...colorTokens.light,
  indigo,
  cyan,
  teal,
  sky,
  mint,
  amber,
  slate,
}

const colorsDark = {
  ...colorTokens.dark,
  indigoDark,
  cyanDark,
  tealDark,
  skyDark,
  mintDark,
  amberDark,
  slateDark,
}

export const newthemes = createThemes<
  keyof typeof colorsLight,
  keyof typeof colorTokens.light
>({
  activeColor: 'blue',
  light: [
    '#fff',
    '#f4f4f4',
    'hsl(0, 0%, 99.0%)',
    'hsl(0, 0%, 97.3%)',
    'hsl(0, 0%, 95.1%)',
    'hsl(0, 0%, 93.0%)',
    'hsl(0, 0%, 90.9%)',
    'hsl(0, 0%, 88.7%)',
    'hsl(0, 0%, 85.8%)',
    'hsl(0, 0%, 78.0%)',
    'hsl(0, 0%, 56.1%)',
    'hsl(0, 0%, 52.3%)',
    'hsl(0, 0%, 43.5%)',
    'hsl(0, 0%, 9.0%)',
  ],
  dark: [
    '#111111',
    '#151515',
    '#191919',
    '#232323',
    '#282828',
    '#323232',
    '#383838',
    '#424242',
    '#494949',
    '#545454',
    '#626262',
    '#777777',
  ],
  colorsLight,
  colorsDark,
})

export const config = createTamagui({
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: newthemes,
  tokens,
  media: createMedia({
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
  }),
})
