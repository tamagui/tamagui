import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { View, Text, createTamagui, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles, findRule } from './utils'

// standard tailwind utilities that styleMode previously passed through as no-op classes.
// text-style utilities apply on Text (View filters them); layout ones apply on View.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

function ruleFor(comp: any, className: string, prop: string) {
  const styles = simplifiedGetSplitStyles(comp, { className } as any)
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

describe('styleMode standard utilities', () => {
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
    const styles = simplifiedGetSplitStyles(Text, { className: 'hover:font-bold' } as any)
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const hoverRule = rules.find((r) => r[StyleObjectValue] === '700')
    expect(hoverRule).toBeTruthy()
  })
})
