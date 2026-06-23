import type { TextStyle } from '@tamagui/web'

import { shorthands as v5Shorthands } from './v5'

export const shorthands = createShorthands({
  ...v5Shorthands,
  basis: 'flexBasis',
  h: 'height',
  w: 'width',
})

function createShorthands<A extends Record<string, keyof TextStyle>>(a: A) {
  return a
}

export type Shorthands = typeof shorthands
export type ShorthandKeys = keyof Shorthands
