import type { TextStyle } from '@tamagui/web'

// v6 = v4/v5 shorthands + Tailwind-style `w`/`h` (Tailwind uses w-*/h-* for width/height).
// this is the first step toward making styleMode:'tailwind' a real Tailwind drop-in.
export const shorthands = createShorthands({
  // text
  text: 'textAlign',

  // view
  b: 'bottom',
  bg: 'backgroundColor',
  content: 'alignContent',
  grow: 'flexGrow',
  h: 'height',
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
  w: 'width',
  z: 'zIndex',
})

// type helper
function createShorthands<A extends Record<string, keyof TextStyle>>(a: A) {
  return a
}

export type Shorthands = typeof shorthands
export type ShorthandKeys = keyof Shorthands
