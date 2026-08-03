import { describe, expect, test } from 'bun:test'

import { themes as authoredThemes } from '@tamagui/themes/builder'
import { createTamagui } from '@tamagui/web'
import { colors, defaultConfig, themes, tokens } from '../src/v6'

describe('v6 config', () => {
  test('ships the statically generated form of the authored themes', () => {
    expect(themes).toEqual(authoredThemes)
    expect(colors).toEqual({ themes, colorTokens: tokens.color })
  })

  test('creates a Tamagui config with the v6 tokens and themes', () => {
    const created = createTamagui(defaultConfig)
    expect(created.themes.light.background).toBeTruthy()
    expect(created.themes.dark.background).toBeTruthy()
    expect(created.tokensParsed.color['brand-600']).toBeTruthy()
    expect(created.tokensParsed.color['shadow-7']).toBeTruthy()
    expect(created.tokensParsed.space['4']).toBeTruthy()
    expect(created.shorthands?.w).toBe('width')
  })

  test('uses eleven scheme-relative ramp values', () => {
    expect(themes.light.color1).toBe(tokens.color['gray-50'])
    expect(themes.light.color11).toBe(tokens.color['gray-950'])
    expect(themes.dark.color1).toBe(tokens.color['gray-950'])
    expect(themes.dark.color11).toBe(tokens.color['gray-50'])
    expect(themes.light).not.toHaveProperty('color12')
  })

  test('deduplicates inverse and saturated semantic levels', () => {
    expect(themes.light_inverse).toBe(themes.dark)
    expect(themes.light_inverse_level2).toBe(themes.dark_level2)
    expect(themes.light_red_level2).not.toBe(themes.light_red)
    expect(themes.light_red_level3).toBe(themes.light_red_level2)
    expect(themes.light_red_level4).toBe(themes.light_red_level2)
    expect(themes.light_red_level2.background).toBe(tokens.color['red-50'])
  })
})
