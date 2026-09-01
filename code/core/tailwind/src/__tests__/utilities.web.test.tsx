import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { StyleObjectValue, createTamagui } from '@tamagui/web'
import { Text, View } from '../index'
import { findRule, splitTailwindStyles } from './utils'

// standard tailwind utilities that styleMode previously passed through as no-op classes.
// text-style utilities apply on Text (View filters them); layout ones apply on View.
beforeAll(() => {
  createTamagui(defaultConfig as any)
})

function ruleFor(comp: any, className: string, prop: string) {
  const styles = splitTailwindStyles(comp, { className } as any)
  return findRule(styles.rulesToInsert, prop)
}

const textCases: [string, string, any][] = [
  ['font-bold', 'fontWeight', '700'],
  ['font-semibold', 'fontWeight', '600'],
  ['font-extrabold', 'fontWeight', '800'],
  ['font-black', 'fontWeight', '900'],
  ['italic', 'fontStyle', 'italic'],
  ['not-italic', 'fontStyle', 'normal'],
  ['uppercase', 'textTransform', 'uppercase'],
  ['lowercase', 'textTransform', 'lowercase'],
  ['capitalize', 'textTransform', 'capitalize'],
  ['underline', 'textDecorationLine', 'underline'],
  ['line-through', 'textDecorationLine', 'line-through'],
  ['no-underline', 'textDecorationLine', 'none'],
]

const viewCases: [string, string, any][] = [
  ['object-contain', 'objectFit', 'contain'],
  ['object-cover', 'objectFit', 'cover'],
  ['fixed', 'position', 'fixed'],
  ['sticky', 'position', 'sticky'],
  ['pointer-events-none', 'pointerEvents', 'none'],
  ['pointer-events-auto', 'pointerEvents', 'auto'],
]

describe('tailwind standard utilities', () => {
  for (const [className, prop, value] of textCases) {
    test(`Text ${className} → ${prop}=${value}`, () => {
      const rule = ruleFor(Text, className, prop)
      expect(rule).toBeTruthy()
      expect(rule[StyleObjectValue]).toBe(value)
    })
  }

  for (const [className, prop, value] of viewCases) {
    test(`View ${className} → ${prop}=${value}`, () => {
      const rule = ruleFor(View, className, prop)
      expect(rule).toBeTruthy()
      expect(rule[StyleObjectValue]).toBe(value)
    })
  }

  test('utilities compose with modifiers (hover:font-bold)', () => {
    const styles = splitTailwindStyles(Text, { className: 'hover:font-bold' } as any)
    const rules = (styles.rulesToInsert[styles.classNames.fontWeight]?.[4] ?? []).join('')
    expect(rules).toContain(':hover')
    expect(rules).toContain('700')
  })

  // font-* is fontFamily (font weights are separate, tested above)
  const fontFamilyCases: [string, any][] = [
    ['font-mono', 'monospace'],
    ['font-sans', 'sans-serif'],
    ['font-serif', 'serif'],
    ['font-[Inter]', 'Inter'],
  ]
  for (const [className, value] of fontFamilyCases) {
    test(`Text ${className} → fontFamily=${value}`, () => {
      const rule = ruleFor(Text, className, 'fontFamily')
      expect(rule).toBeTruthy()
      expect(rule[StyleObjectValue]).toBe(value)
    })
  }

  test('font-<tamaguiFamily> resolves to a font-family css var', () => {
    const rule = ruleFor(Text, 'font-heading', 'fontFamily')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('font-bold still maps to fontWeight, not fontFamily', () => {
    const rule = ruleFor(Text, 'font-bold', 'fontWeight')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('700')
  })

  test('size-10 sets width and height from the size token', () => {
    const styles = splitTailwindStyles(View, { className: 'size-10' } as any)
    expect(findRule(styles.rulesToInsert, 'width')[StyleObjectValue]).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'height')[StyleObjectValue]).toContain('var(--')
  })

  test('rounded-t-xl sets only the top corners', () => {
    const styles = splitTailwindStyles(View, { className: 'rounded-t-xl' } as any)
    expect(
      findRule(styles.rulesToInsert, 'borderTopLeftRadius')[StyleObjectValue]
    ).toContain('var(--')
    expect(
      findRule(styles.rulesToInsert, 'borderTopRightRadius')[StyleObjectValue]
    ).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'borderBottomLeftRadius')).toBeNull()
  })

  test('border-t-4 sets only the top width', () => {
    const styles = splitTailwindStyles(View, { className: 'border-t-4' } as any)
    expect(findRule(styles.rulesToInsert, 'borderTopWidth')[StyleObjectValue]).toContain(
      'var(--'
    )
    expect(findRule(styles.rulesToInsert, 'borderLeftWidth')).toBeNull()
  })

  test('bare border-x sets left and right width to 1', () => {
    const styles = splitTailwindStyles(View, { className: 'border-x' } as any)
    expect(findRule(styles.rulesToInsert, 'borderLeftWidth')[StyleObjectValue]).toBe(
      '1px'
    )
    expect(findRule(styles.rulesToInsert, 'borderRightWidth')[StyleObjectValue]).toBe(
      '1px'
    )
  })

  test('inset-x-0 pins left and right', () => {
    const styles = splitTailwindStyles(View, { className: 'inset-x-0' } as any)
    expect(findRule(styles.rulesToInsert, 'left')[StyleObjectValue]).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'right')[StyleObjectValue]).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'top')).toBeNull()
  })
})
