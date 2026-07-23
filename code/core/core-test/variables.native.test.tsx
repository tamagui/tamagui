process.env.TAMAGUI_TARGET = 'native'

import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'
import { createTamagui, getMergedInlineTheme, inlineLayerKey, px } from '../web/src'

const conf = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  variables: {
    surfaceBorder: '$color',
    disabledOpacity: 0.5,
    focusRingWidth: 2,
    radius: 9,
    accent: { light: '#001', dark: '#ffe' },
    chained: '$surfaceBorder',
  },
})

const lightTheme = conf.themes.light as any

describe('getMergedInlineTheme (native inline layer)', () => {
  test('overrides listed keys, inherits the rest, keeps parent untouched', () => {
    const merged: any = getMergedInlineTheme(
      lightTheme,
      { values: { surfaceBorder: 'red' } },
      'light',
      conf
    )
    expect(merged).not.toBe(lightTheme)
    expect(merged.surfaceBorder.val).toBe('red')
    expect(merged.background.val).toBe(lightTheme.background.val)
    expect(lightTheme.surfaceBorder.val).toBe(lightTheme.color.val)
  })

  test('identity-stable per (parent, values, scheme) and idempotent', () => {
    const inline = { values: { surfaceBorder: 'red' } }
    const a = getMergedInlineTheme(lightTheme, inline, 'light', conf)
    const b = getMergedInlineTheme(
      lightTheme,
      { values: { surfaceBorder: 'red' } },
      'light',
      conf
    )
    expect(a).toBe(b)
    // re-applying the same layer to its own output is a no-op
    expect(getMergedInlineTheme(a as any, inline, 'light', conf)).toBe(a)
  })

  test('empty layer returns the parent theme itself', () => {
    expect(getMergedInlineTheme(lightTheme, {}, 'light', conf)).toBe(lightTheme)
    expect(getMergedInlineTheme(lightTheme, { values: {} }, 'light', conf)).toBe(
      lightTheme
    )
  })

  test('scheme-effective merge: dark bucket wins under dark', () => {
    const inline = {
      values: { surfaceBorder: '#111' },
      dark: { surfaceBorder: '#eee' },
    }
    const light: any = getMergedInlineTheme(lightTheme, inline, 'light', conf)
    const dark: any = getMergedInlineTheme(conf.themes.dark as any, inline, 'dark', conf)
    expect(light.surfaceBorder.val).toBe('#111')
    expect(dark.surfaceBorder.val).toBe('#eee')
  })

  test('references resolve: siblings, parent theme keys, tokens; px strips to number', () => {
    const merged: any = getMergedInlineTheme(
      lightTheme,
      {
        values: {
          accent: '$surfaceBorder',
          surfaceBorder: '$background',
          focusRingWidth: '10px',
          disabledOpacity: '$color.white' as any,
          radius: px(6),
        } as any,
      },
      'light',
      conf
    )
    // sibling chain: accent -> surfaceBorder -> parent background
    expect(merged.accent.val).toBe(lightTheme.background.val)
    expect(merged.surfaceBorder.val).toBe(lightTheme.background.val)
    // px string parses to number on native
    expect(merged.focusRingWidth.val).toBe(10)
    // qualified token resolves through specificTokens
    expect(merged.disabledOpacity.val).toBe('#fff')
    // px() helper resolves to its numeric value
    expect(merged.radius?.val).toBe(6)
  })

  test('cycle-involved keys drop on native exactly like web', () => {
    const merged: any = getMergedInlineTheme(
      lightTheme,
      {
        values: { surfaceBorder: '$chained', chained: '$surfaceBorder', accent: '#123' },
      },
      'light',
      conf
    )
    // dropped keys fall back to the parent (config) values
    expect(merged.surfaceBorder.val).toBe(lightTheme.surfaceBorder.val)
    expect(merged.chained.val).toBe(lightTheme.chained.val)
    expect(merged.accent.val).toBe('#123')

    // cycle in one scheme-effective map drops everywhere (parity contract)
    const scheme: any = getMergedInlineTheme(
      lightTheme,
      {
        values: { surfaceBorder: '$chained', chained: '$surfaceBorder' },
        dark: { chained: 'red' },
      },
      'light',
      conf
    )
    expect(scheme).toBe(lightTheme)
  })

  test('unknown keys drop', () => {
    expect(
      getMergedInlineTheme(lightTheme, { values: { nope: 'red' } as any }, 'light', conf)
    ).toBe(lightTheme)
  })

  test('layer info: overridden set and literal-only iOS pairs', () => {
    const merged: any = getMergedInlineTheme(
      lightTheme,
      {
        values: { accent: '#111', surfaceBorder: '$background' },
        dark: { accent: '#eee' },
      },
      'light',
      conf
    )
    const info = merged[inlineLayerKey]
    expect(info.overridden.has('accent')).toBe(true)
    expect(info.overridden.has('surfaceBorder')).toBe(true)
    // literal both sides -> pair for the DynamicColorIOS fast path
    expect(info.pairs.accent).toEqual({ light: '#111', dark: '#eee' })
    // reference -> no pair (deopts to tracked path)
    expect(info.pairs.surfaceBorder).toBe(undefined)
  })

  test('nested layers carry parent overrides forward', () => {
    const outer: any = getMergedInlineTheme(
      lightTheme,
      { values: { accent: '#111' }, dark: { accent: '#eee' } },
      'light',
      conf
    )
    const inner: any = getMergedInlineTheme(
      outer,
      { values: { surfaceBorder: 'green' } },
      'light',
      conf
    )
    expect(inner.accent.val).toBe('#111')
    expect(inner.surfaceBorder.val).toBe('green')
    const info = inner[inlineLayerKey]
    expect(info.overridden.has('accent')).toBe(true)
    expect(info.pairs.accent).toEqual({ light: '#111', dark: '#eee' })
  })
})
