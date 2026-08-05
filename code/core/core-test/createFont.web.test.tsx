import { describe, expect, test } from 'vitest'

import { createFont } from '../core/src'
import type { GenericFont } from '../core/src'
import { getFontSized } from '../get-font-sized/src'

const font: GenericFont = {
  family: 'Inter',
  size: {
    1: 11,
    2: 12,
    3: 14,
    4: 16,
    5: 20,
    6: 24,
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 24,
    6: 28,
  },
  transform: {
    3: 'uppercase',
    4: 'none',
  },
  weight: {
    1: '400',
    3: '700',
  },
  color: {
    1: '$colorFocus',
    6: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: 0,
    9: -1,
    10: -1.5,
    12: -2,
    14: -3,
    15: -4,
  },
  face: {
    700: { normal: 'InterBold' },
    800: { normal: 'InterBold' },
  },
}

const expectedProcessedFont: GenericFont = {
  family: 'Inter',
  size: {
    1: 11,
    2: 12,
    3: 14,
    4: 16,
    5: 20,
    6: 24,
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 24,
    6: 28,
  },
  transform: {
    1: 'uppercase',
    2: 'uppercase',
    3: 'uppercase',
    4: 'none',
    5: 'none',
    6: 'none',
  },
  weight: {
    1: '400',
    2: '400',
    3: '700',
    4: '700',
    5: '700',
    6: '700',
  },
  color: {
    1: '$colorFocus',
    2: '$colorFocus',
    3: '$colorFocus',
    4: '$colorFocus',
    5: '$colorFocus',
    6: '$color',
  },
  letterSpacing: {
    1: 2,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 1,
    7: 0,
    8: 0,
    9: -1,
    10: -1.5,
    12: -2,
    14: -3,
    15: -4,
  },
  face: {
    100: { normal: 'Inter' },
    200: { normal: 'Inter' },
    300: { normal: 'Inter' },
    400: { normal: 'Inter' },
    500: { normal: 'Inter' },
    600: { normal: 'Inter' },
    700: { normal: 'InterBold' },
    800: { normal: 'InterBold' },
    900: { normal: 'InterBold' },
  },
}

describe('createFont', () => {
  test('should return a font object with normalised property hashes', () => {
    const processedFont = createFont(font)

    expect(processedFont).toStrictEqual(expectedProcessedFont)
  })
})

describe('getFontSized', () => {
  // tokens are keyed by strings like "$true" / "$9", so a numeric size has no
  // entry in the size/lineHeight maps. Build a font with both so we can compare
  // the token path against a raw-number override.
  const sizedFont = {
    family: 'Inter',
    size: { $true: 16, $9: 32 },
    lineHeight: { $true: 24, $9: 38 },
  } as unknown as GenericFont

  const extras = { font: sizedFont, fontFamily: '$body', props: {} } as any

  test('a size token still pairs its fontSize with the token lineHeight', () => {
    const style = getFontSized('$9' as any, extras) as any
    expect(style.fontSize).toBe(32)
    expect(style.lineHeight).toBe(38)
  })

  // regression for #4028: a numeric fontSize used to fall through every token
  // lookup and return nothing, leaving the default "$true" lineHeight in place
  // and clipping glyph tops on iOS. It must now apply the number as a literal
  // fontSize and carry no mismatched token lineHeight.
  test('a numeric size applies as a literal fontSize and drops the token lineHeight', () => {
    const style = getFontSized(32 as any, extras) as any
    expect(style.fontSize).toBe(32)
    expect(style.lineHeight).toBeUndefined()
  })
})
