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
    expect(created.tokensParsed.space['4']).toBeTruthy()
    expect(created.tokensParsed.space['0.5']).toBeTruthy()
    expect(created.tokensParsed.space['0.5'].val).toBe(
      created.tokensParsed.space['0-5'].val
    )
    expect(created.shorthands?.w).toBe('width')
  })

  test('uses eleven scheme-relative ramp values', () => {
    // the default themes ground on mauve, not tailwind gray: gray crams four of
    // its eleven steps against white and four against black, so the top of the
    // ramp reads as one solid colour and a level cannot be seen at all
    expect(themes.light['color-1']).toBe(tokens.color['mauve-50'])
    expect(themes.light['color-11']).toBe(tokens.color['mauve-950'])
    expect(themes.dark['color-1']).toBe(tokens.color['mauve-950'])
    expect(themes.dark['color-11']).toBe(tokens.color['mauve-50'])
    expect(themes.light).not.toHaveProperty('color-12')
  })

  test('deduplicates inverse and saturated semantic levels', () => {
    expect(themes.light_inverse).toBe(themes.dark)
    expect(themes.light_inverse_level2).toBe(themes.dark_level2)
    expect(themes.light_red_level2).not.toBe(themes.light_red)
    // a tint level walks its type shade along with the surface, so it gets
    // three real steps before the type drops under 4.5:1 and it has to stop
    expect(themes.light_red_level3).not.toBe(themes.light_red_level2)
    expect(themes.light_red_level4).toBe(themes.light_red_level3)
    expect(themes.light_red_level2.background).toBe(tokens.color['red-200'])
  })

  test('emits inverse aliases in their base theme declaration blocks', () => {
    const css = createTamagui(defaultConfig).getCSS()
    const inverseSelector = ':root .t_light_inverse:not(#t_theme_full_name)'
    const inverseRule = css.split('\n').find((rule) => rule.includes(inverseSelector))

    expect(inverseRule).toContain(':root.t_dark')
    expect(css.split(inverseSelector)).toHaveLength(2)
  })

  test('shadows are per-theme values, stronger in dark, with no absolute token', () => {
    // one name, one owner: a shadow that also existed as a color token would
    // resolve the same in both schemes and silently lose the scheme difference
    const created = createTamagui(defaultConfig)
    expect(created.tokensParsed.color).not.toHaveProperty('shadow-1')
    expect(created.tokensParsed.color).not.toHaveProperty('shadow-7')

    const alpha = (value: string) => Number(/([\d.]+)\)$/.exec(value)![1])
    for (const step of [1, 2, 3, 4, 5, 6, 7]) {
      const light = themes.light[`shadow-${step}`]
      const dark = themes.dark[`shadow-${step}`]
      expect(alpha(dark)).toBeGreaterThan(alpha(light))
    }
    // an inverse theme is a dark scheme, so it takes the dark ladder
    expect(themes.light_inverse['shadow-4']).toBe(themes.dark['shadow-4'])
    expect(themes.light['shadow-color']).toBe(themes.light['shadow-3'])
    expect(themes.dark['shadow-color']).toBe(themes.dark['shadow-3'])
  })

  test('color scales merge into the base light and dark themes only', () => {
    const config = createV6Config({
      ...colors,
      scales: { red: v5ColorScales.red, brand: v5ColorScales.blue },
    })

    expect(config.themes.light['red-10']).toBe('#dc3e42')
    expect(config.themes.dark['red-10']).toBe('#ec5d5e')
    expect(config.themes.light['brand-1']).toBe(v5ColorScales.blue.light[0])
    expect(config.themes.dark['brand-12']).toBe(v5ColorScales.blue.dark[11])
    // subthemes stay untouched and reach scale keys through parent fallback
    expect(config.themes.light_level2).not.toHaveProperty('brand-1')

    const created = createTamagui(config)
    expect(created.themes.light['brand-10']).toBeTruthy()
    // `--brand-10` alone also matches the `--brand-100` token alias, so pin the
    // declaration end and the step-11 neighbour that only the scale can emit
    expect(created.getCSS()).toContain('--brand-10:')
    expect(created.getCSS()).toContain('--brand-11:')
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
