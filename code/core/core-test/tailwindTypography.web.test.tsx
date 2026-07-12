import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { Text, createTamagui, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles, findRule } from './utils'

// text-* is value-disambiguated (align vs fontSize); leading-* is lineHeight.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

function rule(className: string, prop: string) {
  const styles = simplifiedGetSplitStyles(Text, { className } as any)
  return findRule(styles.rulesToInsert, prop)
}

describe('styleMode fontSize (text-*)', () => {
  test('text-[18px] → fontSize 18px (arbitrary)', () => {
    expect(rule('text-[18px]', 'fontSize')[StyleObjectValue]).toBe('18px')
  })

  test('text-5 → the $5 font-size token', () => {
    expect(rule('text-5', 'fontSize')[StyleObjectValue]).toContain('var(--')
  })

  test('text-center stays textAlign, not fontSize', () => {
    expect(rule('text-center', 'textAlign')[StyleObjectValue]).toBe('center')
    expect(
      findRule(
        simplifiedGetSplitStyles(Text, { className: 'text-center' } as any).rulesToInsert,
        'fontSize'
      )
    ).toBeNull()
  })

  test('text-left stays textAlign', () => {
    expect(rule('text-left', 'textAlign')[StyleObjectValue]).toBe('left')
  })
})

describe('styleMode lineHeight (leading-*)', () => {
  test('leading-[1.25] is unitless (not coerced to px)', () => {
    expect(rule('leading-[1.25]', 'lineHeight')[StyleObjectValue]).toBe('1.25')
  })

  test('leading-[24px] keeps the unit', () => {
    expect(rule('leading-[24px]', 'lineHeight')[StyleObjectValue]).toBe('24px')
  })

  test('leading-8 resolves the $8 lineHeight token', () => {
    expect(rule('leading-8', 'lineHeight')[StyleObjectValue]).toContain('var(--')
  })

  test('named leading-none/tight/loose are unitless multipliers', () => {
    expect(rule('leading-none', 'lineHeight')[StyleObjectValue]).toBe('1')
    expect(rule('leading-tight', 'lineHeight')[StyleObjectValue]).toBe('1.25')
    expect(rule('leading-loose', 'lineHeight')[StyleObjectValue]).toBe('2')
  })
})
