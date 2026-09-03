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
  })

  test('unregistered leading aliases pass through', () => {
    for (const cls of ['leading-none', 'leading-tight', 'leading-loose']) {
      expect(rule(cls, 'lineHeight')).toBeNull()
    }
  })
})
