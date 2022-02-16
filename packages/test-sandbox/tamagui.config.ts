import { createTamagui } from 'tamagui'

import { themes } from './themes'
import { tokens } from './tokens'

const config = createTamagui({
  defaultTheme: 'light',
  shorthands: {
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
    pos: 'position',
    bw: 'borderWidth',
    zi: 'zIndex',
    mw: 'maxWidth',
    mh: 'maxHeight',
    lh: 'lineHeight',
    ta: 'textAlign',
    fos: 'fontSize',
  } as const,
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
    xl: { minWidth: 1280 },
    xxl: { minWidth: 1420 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
