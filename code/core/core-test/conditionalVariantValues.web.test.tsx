process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import { Text, View, createTamagui, styled } from '../web/src'
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

const ParentRatio = styled(View, {
  variants: {
    ratio: {
      '16:9': {
        height: '9px hover:10px active:11px group-active/card:12px disabled:8px',
      },
    },
  } as const,
})

const ChildRatio = styled(ParentRatio, {
  variants: {
    ratio: {
      '16:9': {
        height: '13px press:14px group-press/card:15px focus:16px',
      },
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

const shape = (css: string[]) => css.map((rule) => rule.replace(/_[a-z]+-\d+/g, '_class'))

describe('conditional clauses on a variant prop', () => {
  test('a later styled font weight overrides every output of a responsive size variant', () => {
    const Weighted = styled(Text, {
      variants: {
        size: {
          small: { fontSize: 12, fontWeight: '400' },
          large: { fontSize: 30, fontWeight: '600' },
        },
      } as const,
    })
    const Static = styled(Weighted, { size: 'large', fontWeight: '300' })
    const Responsive = styled(Weighted, {
      size: 'small sm:large',
      fontWeight: '300',
    })

    for (const sm of [false, true]) {
      const options = { noClass: true, mediaState: { sm } }
      expect(simplifiedGetSplitStyles(Static, {}, options).style?.fontWeight).toBe(300)
      const style = simplifiedGetSplitStyles(Responsive, {}, options).style
      expect(style?.fontSize).toBe(sm ? 30 : 12)
      expect(style?.fontWeight).toBe(300)
    }
    const css = Object.values(
      simplifiedGetSplitStyles(Responsive, {}).rulesToInsert ?? {}
    ).flatMap((rule: any) => rule[4] ?? [])
    expect(css.filter((rule) => rule.includes('font-weight:'))).toHaveLength(1)
    expect(css.find((rule) => rule.includes('font-weight:'))).toContain('font-weight:300')
  })

  test('a media clause picks a different variant value under that media', () => {
    const css = cssFor({ size: 'large sm:small' })
    expect(shape(css)).toEqual([
      '._class{width:200px}',
      '@media (max-width: 800px) {._class{width:50px}}',
    ])
  })

  test('a pseudo clause picks a different variant value in that state', () => {
    const css = cssFor({ size: 'large hover:small' })
    expect(shape(css)).toEqual([
      '._class{width:200px}',
      '@media (hover: hover) {._class:where(:hover){width:50px}}',
    ])
  })

  test('modifiers chain, so hover:sm: nests both conditions', () => {
    const css = cssFor({ size: 'large hover:sm:small' })
    expect(shape(css)).toEqual([
      '._class{width:200px}',
      '@media (hover: hover) {@media (max-width: 800px) {._class:where(:hover){width:50px}}}',
    ])
  })

  test('an exact variant key containing a colon wins over clause parsing', () => {
    expect(shape(cssFor({ ratio: '16:9' }))).toEqual(['._class{height:9px}'])
  })

  test('styled inheritance merges canonical clause slots under an exact colon key', () => {
    expect((ChildRatio.staticConfig.variants!.ratio as any)['16:9'].height).toBe(
      '13px hover:10px disabled:8px press:14px group-press/card:15px focus:16px'
    )
    expect(
      simplifiedGetSplitStyles(ChildRatio, { ratio: '16:9' }, { noClass: true }).style
        ?.height
    ).toBe(13)
  })

  test('an unresolvable modifier drops only its clause', () => {
    expect(shape(cssFor({ size: 'large notARealModifier:small hover:small' }))).toEqual([
      '._class{width:200px}',
      '@media (hover: hover) {._class:where(:hover){width:50px}}',
    ])
  })
})
