import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui, getConfig, StyleObjectValue } from '../web/src'
import { Text, View } from '../tailwind/src'
import { findRule, splitTailwindStyles } from '../tailwind/src/__tests__/utils'

// the tailwind frontend should resolve semantic theme-value color names (color1-11,
// background, border-color, …) to their theme css var (var(--color5)), theme-aware
// and never as a dead literal through the shared property-scoped lookup.
beforeAll(() => {
  createTamagui(defaultConfig)
})

function theme() {
  return getConfig().themes.light
}

function colorRule(className: string, prop: string) {
  // `color` is a text style prop, so text-family classes split against Text
  const host = prop === 'color' ? Text : View
  const styles = splitTailwindStyles(host, { className }, { theme: theme() })
  return findRule(styles.rulesToInsert, prop)
}

describe('tailwind theme-value color classes', () => {
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

  test('border-border-color resolves to var(--border-color)', () => {
    const rule = colorRule('border-border-color', 'borderTopColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('var(--border-color)')
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
    expect(getConfig().tokensParsed.color).toHaveProperty('blue-500')
    const rule = colorRule('bg-blue-500', 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('var(--c-color-blue-500)')
  })

  test('an unconfigured palette name passes through', () => {
    expect(getConfig().tokensParsed.color).not.toHaveProperty('unconfigured-500')
    expect(colorRule('bg-unconfigured-500', 'backgroundColor')).toBeNull()
  })

  test('non-color arbitrary width is unaffected', () => {
    const styles = splitTailwindStyles(
      View,
      { className: 'w-[400px]' },
      {
        theme: theme(),
      }
    )
    const rule = findRule(styles.rulesToInsert, 'width')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('400px')
  })
})
