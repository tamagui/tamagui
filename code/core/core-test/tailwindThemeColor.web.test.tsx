import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { View, createTamagui, getConfig, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles, findRule } from './utils'

// styleMode tailwind should resolve semantic THEME-value color names (color1-12,
// background, borderColor, …) to their theme CSS var (var(--color5)) — theme-aware —
// not a dead literal. see getSplitStyles resolveTokenValue.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

function theme() {
  return (getConfig() as any).themes.light
}

function colorRule(className: string, prop: string) {
  const styles = simplifiedGetSplitStyles(View, { className } as any, { theme: theme() })
  return findRule(styles.rulesToInsert, prop)
}

describe('styleMode theme-value color classes', () => {
  test('bg-color5 resolves to var(--color5) (theme-aware, not literal)', () => {
    const rule = colorRule('bg-color5', 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('var(--color5)')
  })

  test('color-color10 resolves to var(--color10)', () => {
    const rule = colorRule('color-color10', 'color')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('var(--color10)')
  })

  test('border-borderColor resolves to var(--borderColor)', () => {
    const rule = colorRule('border-borderColor', 'borderTopColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('var(--borderColor)')
  })

  test('bg-background resolves to var(--background)', () => {
    const rule = colorRule('bg-background', 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('var(--background)')
  })

  test('non-theme raw color keyword bg-red stays literal', () => {
    const rule = colorRule('bg-red', 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')
  })

  test('palette token bg-blue-500 still resolves to a css var', () => {
    const rule = colorRule('bg-blue-500', 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('non-color scale class w-100 is unaffected', () => {
    const styles = simplifiedGetSplitStyles(View, { className: 'w-100' } as any, {
      theme: theme(),
    })
    const rule = findRule(styles.rulesToInsert, 'width')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('400px')
  })
})
