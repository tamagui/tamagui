import { tokens, themes as themesIn } from '@tamagui/themes/v3-themes'
import { animations } from './v3-animations'
import type { CreateTamaguiProps } from '@tamagui/web'

import { fonts } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

// fix vite - react native uses global which it doesn't provide
globalThis['global'] ||= globalThis

// v3 shorthands (inlined from deprecated @tamagui/shorthands/v2)
export const shorthands = {
  ussel: 'userSelect',
  cur: 'cursor',
  pe: 'pointerEvents',
  col: 'color',
  ff: 'fontFamily',
  fos: 'fontSize',
  fost: 'fontStyle',
  fow: 'fontWeight',
  ls: 'letterSpacing',
  lh: 'lineHeight',
  ta: 'textAlign',
  tt: 'textTransform',
  ww: 'wordWrap',
  ac: 'alignContent',
  ai: 'alignItems',
  als: 'alignSelf',
  b: 'bottom',
  bg: 'backgroundColor',
  bbc: 'borderBottomColor',
  bblr: 'borderBottomLeftRadius',
  bbrr: 'borderBottomRightRadius',
  bbw: 'borderBottomWidth',
  blc: 'borderLeftColor',
  blw: 'borderLeftWidth',
  bc: 'borderColor',
  br: 'borderRadius',
  bs: 'borderStyle',
  brw: 'borderRightWidth',
  brc: 'borderRightColor',
  btc: 'borderTopColor',
  btlr: 'borderTopLeftRadius',
  btrr: 'borderTopRightRadius',
  btw: 'borderTopWidth',
  bw: 'borderWidth',
  dsp: 'display',
  f: 'flex',
  fb: 'flexBasis',
  fd: 'flexDirection',
  fg: 'flexGrow',
  fs: 'flexShrink',
  fw: 'flexWrap',
  h: 'height',
  jc: 'justifyContent',
  l: 'left',
  m: 'margin',
  mah: 'maxHeight',
  maw: 'maxWidth',
  mb: 'marginBottom',
  mih: 'minHeight',
  miw: 'minWidth',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  o: 'opacity',
  ov: 'overflow',
  p: 'padding',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pos: 'position',
  pr: 'paddingRight',
  pt: 'paddingTop',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  r: 'right',
  shac: 'shadowColor',
  shar: 'shadowRadius',
  shof: 'shadowOffset',
  shop: 'shadowOpacity',
  t: 'top',
  w: 'width',
  zi: 'zIndex',
} as const

export { animations } from './v3-animations'
export { tokens, themes } from '@tamagui/themes/v3-themes'
export { fonts } from './fonts'
export { media, mediaQueryDefaultActive } from './media'

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

export const config = {
  animations,
  themes,
  media,
  shorthands,
  tokens,
  fonts,
  selectionStyles,
  settings: {
    mediaQueryDefaultActive,
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: true,
  },
} satisfies CreateTamaguiProps
