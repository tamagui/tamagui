import { describe, expect, test } from 'bun:test'

import { themes as authoredThemes } from '@tamagui/themes/builder'
import { v5ColorScales } from '@tamagui/themes/v5-color-scales'
import { createTamagui } from '@tamagui/web'
import { colors, createV6Config, defaultConfig, themes, tokens } from '../src/v6'

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
    expect(created.tokensParsed.space['0.5']).toBeTruthy()
    expect(created.tokensParsed.space['0.5'].val).toBe(
      created.tokensParsed.space['0-5'].val
    )
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

  test('emits inverse aliases in their base theme declaration blocks', () => {
    const css = createTamagui(defaultConfig).getCSS()
    const inverseSelector = ':root .t_light_inverse:not(#t_theme_full_name)'
    const inverseRule = css.split('\n').find((rule) => rule.includes(inverseSelector))

    expect(inverseRule).toContain(':root.t_dark')
    expect(css.split(inverseSelector)).toHaveLength(2)
  })

  test('color scales merge into the base light and dark themes only', () => {
    const config = createV6Config({
      ...colors,
      scales: { red: v5ColorScales.red, brand: v5ColorScales.blue },
    })

    expect(config.themes.light.red10).toBe('#dc3e42')
    expect(config.themes.dark.red10).toBe('#ec5d5e')
    expect(config.themes.light.brand1).toBe(v5ColorScales.blue.light[0])
    expect(config.themes.dark.brand12).toBe(v5ColorScales.blue.dark[11])
    // subthemes stay untouched and reach scale keys through parent fallback
    expect(config.themes.light_level2).not.toHaveProperty('brand1')

    const created = createTamagui(config)
    expect(created.themes.light.brand10).toBeTruthy()
    expect(created.getCSS()).toContain('--brand10')
  })

  test('a scale without exactly 12 steps throws', () => {
    expect(() =>
      createV6Config({
        ...colors,
        scales: { brand: { light: ['#fff'], dark: ['#000'] } as any },
      })
    ).toThrow('exactly 12')
  })
})
