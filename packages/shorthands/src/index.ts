// warning : createShorthands here causes freakout in vite importing react-native
// and i aint got time for dat

export const shorthands = {
  // web-only
  ussel: 'userSelect',
  cur: 'cursor',

  // tamagui
  pe: 'pointerEvents',

  // text
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

  // view
  ac: 'alignContent',
  ai: 'alignItems',
  als: 'alignSelf',
  b: 'bottom',
  bc: 'backgroundColor',
  bg: 'backgroundColor',
  bbc: 'borderBottomColor',
  bblr: 'borderBottomLeftRadius',
  bbrr: 'borderBottomRightRadius',
  bbw: 'borderBottomWidth',
  blc: 'borderLeftColor',
  blw: 'borderLeftWidth',
  boc: 'borderColor',
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

// add in some just for compiler output
shorthands['bls'] = 'borderLeftStyle'
shorthands['brs'] = 'borderRightStyle'
shorthands['bts'] = 'borderTopStyle'
shorthands['bbs'] = 'borderBottomStyle'
shorthands['bxs'] = 'boxSizing'
shorthands['bxsh'] = 'boxShadow'
shorthands['ox'] = 'overflowX'
shorthands['oy'] = 'overflowY'
