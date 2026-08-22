process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import { View, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

const Sized = styled(View, {
  variants: {
    size: {
      large: { width: 200 },
      small: { width: 50 },
    },
    // a variant may key on a literal colon, which must not be read as a clause
    ratio: {
      '16:9': { height: 9 },
    },
  } as const,
})

// index 4 of a StyleObject is the emitted CSS, the only place a media or pseudo
// condition is visible — property and value alone cannot tell a base rule from a
// conditional one
const cssFor = (props: Record<string, any>) =>
  Object.values(simplifiedGetSplitStyles(Sized, props).rulesToInsert ?? {}).flatMap(
    (rule: any) => rule[4] ?? []
  )

describe('conditional clauses on a variant prop', () => {
  test('a media clause picks a different variant value under that media', () => {
    const css = cssFor({ size: 'large sm:small' })
    expect(css).toEqual([
      '._w-450003261{width:200px}',
      '@media (max-width: 800px) {._w-450003261._w-450003261{width:50px}}',
    ])
  })

  test('a pseudo clause picks a different variant value in that state', () => {
    const css = cssFor({ size: 'large hover:small' })
    expect(css).toEqual([
      '._w-1598328809{width:200px}',
      '@media (hover: hover) {._w-1598328809:hover{width:50px}}',
    ])
  })

  test('modifiers chain, so hover:sm: nests both conditions', () => {
    const css = cssFor({ size: 'large hover:sm:small' })
    expect(css).toEqual([
      '._w-75456123{width:200px}',
      '@media (hover: hover) {@media (max-width: 800px) {._w-75456123._w-75456123:hover{width:50px}}}',
    ])
  })

  test('an exact variant key containing a colon wins over clause parsing', () => {
    expect(cssFor({ ratio: '16:9' })).toEqual(['._h-1387432580{height:9px}'])
  })

  test('an unresolvable modifier refuses the whole value rather than half-applying it', () => {
    expect(cssFor({ size: 'large notARealModifier:small' })).toEqual([])
  })
})
