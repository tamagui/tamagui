import { createFont, createTamagui, createTokens } from '@tamagui/core'

const size = {
  0: 0,
  1: 5,
  2: 10,
  3: 15,
  4: 20,
  5: 25,
  6: 30,
  7: 40,
  8: 50,
  9: 75,
  10: 100,
  true: 10,
}

const space = {
  ...size,
  '-0': -0,
  '-1': -5,
  '-2': -10,
  '-3': -15,
  '-4': -20,
  '-5': -25,
  '-6': -30,
  '-7': -40,
  '-8': -50,
  '-9': -75,
  '-10': -100,
}

const systemFont = createFont({
  family:
    '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
    5: 17,
    6: 18,
    7: 20,
    8: 21,
    9: 38,
    10: 44,
    11: 68,
    12: 76,
  },
  lineHeight: {
    1: 17,
    2: 22,
    3: 25,
    4: 26,
    5: 30,
    6: 31,
    7: 35,
    8: 42,
    9: 48,
    10: 56,
    11: 75,
    12: 88,
  },
  weight: {
    4: '300',
    6: '600',
    8: '700',
  },
  letterSpacing: {
    4: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
  },
})

export const tokens = createTokens({
  size,
  space,
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  color: {
    white: '#fff',
  },
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 10,
    4: 15,
    5: 20,
  },
})

const shorthands = {
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
  pe: 'pointerEvents',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'paddingTop',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  w: 'width',
  zi: 'zIndex',
  lh: 'lineHeight',
  ta: 'textAlign',
}

const light = {
  bg: '#fff',
  bg2: tokens.color.gray3,
  bg3: tokens.color.gray4,
  bg4: tokens.color.gray5,
  bgTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray4,
  borderColor2: tokens.color.gray6,
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray6,
  shadowColor: tokens.color.grayA5,
  shadowColor2: tokens.color.grayA6,
}

export const themes = {
  light,
}

const config = createTamagui({
  defaultTheme: 'light',
  fonts: {
    heading: systemFont,
    body: systemFont,
  },
  shorthands,
  themes,
  tokens,
  media: {
    xs: { maxWidth: 660 },
    gtXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 860 + 1 },
    md: { minWidth: 980 },
    gtMd: { minWidth: 980 + 1 },
    lg: { minWidth: 1120 },
    gtLg: { minWidth: 1120 + 1 },
  },
})

export default config
