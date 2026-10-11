import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { StyleObjectValue, createTamagui } from '@tamagui/web'
import { Text } from '../index'
import { findRule, splitTailwindStyles } from './utils'

// text-* is value-disambiguated (align vs fontSize); leading-* is lineHeight.
beforeAll(() => {
  createTamagui(defaultConfig as any)
})

function rule(className: string, prop: string) {
  const styles = splitTailwindStyles(Text, { className } as any)
  return findRule(styles.rulesToInsert, prop)
}

describe('tailwind fontSize (text-*)', () => {
  test('text-[18px] → fontSize 18px (arbitrary)', () => {
    expect(rule('text-[18px]', 'fontSize')[StyleObjectValue]).toBe('18px')
  })

  test('text-5 → the 5 font-size token', () => {
    expect(rule('text-5', 'fontSize')[StyleObjectValue]).toContain('var(--')
  })

  test('text-center stays textAlign, not fontSize', () => {
    expect(rule('text-center', 'textAlign')[StyleObjectValue]).toBe('center')
    expect(
      findRule(
        splitTailwindStyles(Text, { className: 'text-center' } as any).rulesToInsert,
        'fontSize'
      )
    ).toBeNull()
  })

  test('text-left stays textAlign', () => {
    expect(rule('text-left', 'textAlign')[StyleObjectValue]).toBe('left')
  })

  test('text-sm uses the type-scale fontSize token', () => {
    expect(rule('text-sm', 'fontSize')[StyleObjectValue]).toContain('var(--')
    expect(
      findRule(
        splitTailwindStyles(Text, { className: 'text-sm' } as any).rulesToInsert,
        'textAlign'
      )
    ).toBeNull()
  })

  test('text-white sets color, not alignment or size', () => {
    expect(rule('text-white', 'color')[StyleObjectValue]).toBeTruthy()
    expect(
      findRule(
        splitTailwindStyles(Text, { className: 'text-white' } as any).rulesToInsert,
        'textAlign'
      )
    ).toBeNull()
    expect(
      findRule(
        splitTailwindStyles(Text, { className: 'text-white' } as any).rulesToInsert,
        'fontSize'
      )
    ).toBeNull()
  })

  test('text-[#fff] is an arbitrary color', () => {
    expect(rule('text-[#fff]', 'color')[StyleObjectValue]).toBe('#fff')
  })
})

describe('tailwind lineHeight (leading-*)', () => {
  test('leading-[1.25] is unitless (not coerced to px)', () => {
    expect(rule('leading-[1.25]', 'lineHeight')[StyleObjectValue]).toBe('1.25')
  })

  test('leading-[24px] keeps the unit', () => {
    expect(rule('leading-[24px]', 'lineHeight')[StyleObjectValue]).toBe('24px')
  })

  test('leading-8 resolves through the Tailwind spacing scale', () => {
    expect(rule('leading-8', 'lineHeight')[StyleObjectValue]).toBe('32px')
    expect(rule('leading-0.5', 'lineHeight')[StyleObjectValue]).toBe('2px')
    expect(rule('leading-96', 'lineHeight')[StyleObjectValue]).toBe('384px')
  })

  test('named leading resolves to tailwind ratios', () => {
    for (const [cls, ratio] of [
      ['leading-none', '1'],
      ['leading-tight', '1.25'],
      ['leading-loose', '2'],
    ]) {
      expect(String(rule(cls, 'lineHeight')[StyleObjectValue])).toBe(ratio)
    }
  })
})

describe('tailwind text size line height', () => {
  test('text-xs carries the font line height for its size', () => {
    expect(rule('text-xs', 'lineHeight')[StyleObjectValue]).toBe('var(--f-lineHeight-xs)')
  })

  test('leading wins over the size line height in either order', () => {
    expect(rule('text-xs leading-8', 'lineHeight')[StyleObjectValue]).toBe('32px')
    expect(rule('leading-8 text-xs', 'lineHeight')[StyleObjectValue]).toBe('32px')
  })
})

describe('tailwind border and ring values', () => {
  test('border-2 reads the borderWidth group', () => {
    const styles = splitTailwindStyles(Text, { className: 'border-2' } as any)
    expect(findRule(styles.rulesToInsert, 'borderTopWidth')[StyleObjectValue]).toBe(
      'var(--c-borderWidth-2)'
    )
  })

  test('ring-red-500 resolves its color token', () => {
    const styles = splitTailwindStyles(Text, { className: 'ring-2 ring-red-500' } as any)
    expect(findRule(styles.rulesToInsert, 'boxShadow')[StyleObjectValue]).toContain(
      'var(--c-color-red-500)'
    )
  })
})
