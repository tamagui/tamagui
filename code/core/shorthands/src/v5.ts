import type { TextStyle } from '@tamagui/web'

export const shorthands = createShorthands({
  // text
  text: 'textAlign',

  // view
  b: 'bottom',
  bg: 'backgroundColor',
  content: 'alignContent',
  grow: 'flexGrow',
  items: 'alignItems',
  justify: 'justifyContent',
  l: 'left',
  m: 'margin',
  maxH: 'maxHeight',
  maxW: 'maxWidth',
  mb: 'marginBottom',
  minH: 'minHeight',
  minW: 'minWidth',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  p: 'padding',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'paddingTop',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  r: 'right',
  rounded: 'borderRadius',
  select: 'userSelect',
  self: 'alignSelf',
  shrink: 'flexShrink',
  t: 'top',
  z: 'zIndex',
})

// type helper
function createShorthands<A extends Record<string, keyof TextStyle>>(a: A) {
  return a
}

export type Shorthands = typeof shorthands
export type ShorthandKeys = keyof Shorthands

type NonDefinedShorthandValues = Exclude<keyof TextStyle, Shorthands[ShorthandKeys]>

// we want no types but compiler/runtime uses it for short classname generation
const nonCompilerShorthands: [string, NonDefinedShorthandValues][] = [
  ['fwr', 'flexWrap'],
  ['col', 'color'],
  ['ff', 'fontFamily'],
  ['fst', 'fontStyle'],
  ['tt', 'textTransform'],
  ['td', 'textDecorationLine'],
  ['va', 'verticalAlign'],
  ['ws', 'whiteSpace'],
  // @ts-ignore
  ['wb', 'wordBreak'],
  ['ww', 'wordWrap'],
  ['brc', 'borderRightColor'],
  ['brw', 'borderRightWidth'],
  ['bs', 'borderStyle'],
  ['btc', 'borderTopColor'],
  ['btlr', 'borderTopLeftRadius'],
  ['btrr', 'borderTopRightRadius'],
  ['btw', 'borderTopWidth'],
  ['bw', 'borderWidth'],
  ['o', 'opacity'],
  ['cur', 'cursor'],
  ['pe', 'pointerEvents'],
  ['ov', 'overflow'],
  ['pos', 'position'],
  ['dsp', 'display'],
  ['fw', 'fontWeight'],
  ['fs', 'fontSize'],
  ['ls', 'letterSpacing'],
  ['lh', 'lineHeight'],
  // @ts-ignore
  ['bxs', 'boxSizing'],
  ['bxsh', 'boxShadow'],
  // @ts-ignore
  ['ox', 'overflowX'],
  // @ts-ignore
  ['oy', 'overflowY'],
]

// Merge the non-compiler shorthands into the main object
Object.assign(shorthands, Object.fromEntries(nonCompilerShorthands))
