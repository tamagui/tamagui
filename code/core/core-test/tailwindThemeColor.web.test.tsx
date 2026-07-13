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

  test('bracketed non-theme color keyword stays literal', () => {
    const rule = colorRule('bg-[red]', 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')
  })

  test('a configured palette token resolves to its CSS variable', () => {
    expect((getConfig() as any).tokensParsed.color).toHaveProperty('$blue-500')
    const rule = colorRule('bg-blue-500', 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('var(--blue-500)')
  })

  test('an unconfigured palette name passes through', () => {
    expect((getConfig() as any).tokensParsed.color).not.toHaveProperty('$brand-500')
    expect(colorRule('bg-brand-500', 'backgroundColor')).toBeNull()
  })

  test('non-color arbitrary width is unaffected', () => {
    const styles = simplifiedGetSplitStyles(View, { className: 'w-[400px]' } as any, {
      theme: theme(),
    })
    const rule = findRule(styles.rulesToInsert, 'width')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('400px')
  })
})
