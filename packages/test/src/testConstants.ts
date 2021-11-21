import * as Colors from '@tamagui/colors'
import { createTokens } from '@tamagui/core'

export const shorthands = {
  ac: 'alignContent',
  ai: 'alignItems',
  als: 'alignSelf',
  bblr: 'borderBottomLeftRadius',
  bbrr: 'borderBottomRightRadius',
  bc: 'backgroundColor',
  br: 'borderRadius',
  btlr: 'borderTopLeftRadius',
  btrr: 'borderTopRightRadius',
  f: 'flex',
  fb: 'flexBasis',
  fd: 'flexDirection',
  fg: 'flexGrow',
  fs: 'flexShrink',
  fw: 'flexWrap',
  h: 'height',
  jc: 'justifyContent',
  m: 'margin',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  p: 'padding',
  pb: 'paddingBottom',
  // TODO
  // pe: 'pointerEvents',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'paddingTop',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  w: 'width',
  zi: 'zIndex',
  lh: 'lineHeight',
  ta: 'textAlign',
  fosi: 'fontSize',
} as const

// nice and flat

export const light = {
  ...Colors.amber,
  ...Colors.blue,
  ...Colors.bronze,
  ...Colors.brown,
  ...Colors.crimson,
  ...Colors.cyan,
  ...Colors.gold,
  ...Colors.grass,
  ...Colors.gray,
  ...Colors.grayA,
  ...Colors.green,
  ...Colors.indigo,
  ...Colors.lime,
  ...Colors.mauve,
  ...Colors.mint,
  ...Colors.olive,
  ...Colors.orange,
  ...Colors.pink,
  ...Colors.plum,
  ...Colors.purple,
  ...Colors.red,
  ...Colors.sage,
  ...Colors.sand,
  ...Colors.sky,
  ...Colors.slate,
  ...Colors.teal,
  ...Colors.tomato,
  ...Colors.violet,
  ...Colors.yellow,
}

export const dark = {
  ...Colors.amberDark,
  ...Colors.blueDark,
  ...Colors.bronzeDark,
  ...Colors.brownDark,
  ...Colors.crimsonDark,
  ...Colors.cyanDark,
  ...Colors.goldDark,
  ...Colors.grassDark,
  ...Colors.grayDark,
  ...Colors.grayDarkA,
  ...Colors.greenDark,
  ...Colors.indigoDark,
  ...Colors.limeDark,
  ...Colors.mauveDark,
  ...Colors.mintDark,
  ...Colors.oliveDark,
  ...Colors.orangeDark,
  ...Colors.pinkDark,
  ...Colors.plumDark,
  ...Colors.purpleDark,
  ...Colors.redDark,
  ...Colors.sageDark,
  ...Colors.sandDark,
  ...Colors.skyDark,
  ...Colors.slateDark,
  ...Colors.tealDark,
  ...Colors.tomatoDark,
  ...Colors.violetDark,
  ...Colors.yellowDark,
}

export const darkColorsPostfixed = Object.fromEntries(
  // Dark
  Object.entries(dark).map(([k, v]) => [`${k}Dark`, v])
) as {
  [key in `${keyof typeof dark}Dark`]: string
}

export type ColorNamesLight = keyof typeof light
export type ColorNamesDark = keyof typeof dark

export const colorNamesLight = Object.keys(light) as ColorNamesLight[]
export const colorNamesDark = Object.keys(dark) as ColorNamesDark[]

// const theme = useTheme()
//
// theme.red1
// theme.fontSizeX
// theme.lineHeightX
// theme.spaceX
//
// bg="$red1"

const space = {
  0: 0,
  1: 5,
  2: 10,
  3: 15,
  4: 20,
  5: 25,
  6: 35,
  7: 45,
  8: 60,
  9: 80,
  '10': 100,
  '-0': -0,
  '-1': -5,
  '-2': -10,
  '-3': -15,
  '-4': -20,
  '-5': -25,
  '-6': -35,
  '-7': -45,
  '-8': -60,
  '-9': -80,
  '-10': -100,
}

export const tokens = createTokens({
  letterSpace: {
    0: 0,
    1: 1,
    2: 2,
    '-0': -0,
    '-1': -1,
    '-2': -2,
  },
  space,
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  font: {
    mono: 'Monospace',
    sans: '-system',
  },
  color: {
    ...light,
    ...darkColorsPostfixed,
  },
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 10,
    4: 15,
    5: 20,
  },
  size: space,
  fontSize: {
    1: 12,
    2: 13,
    3: 15,
    4: 17,
    5: 19,
    6: 21,
    7: 27,
    8: 35,
    9: 59,
  },
  lineHeight: {
    1: 12 * 1.2,
    2: 13 * 1.2,
    3: 15 * 1.2,
    4: 17 * 1.2,
    5: 19 * 1.2,
    6: 21 * 1.2,
    7: 27 * 1.2,
    8: 35 * 1.2,
    9: 59 * 1.2,
  },
})
