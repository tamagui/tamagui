import { describe, expect, test } from 'bun:test'

import { createTamagui } from '@tamagui/web'
import { createV6Config, tokens as baseTokens } from '../src/v6-base'
import { createTailwindThemes, tailwindPalettes } from '../src/v6-builder'
import {
  colors as classicColors,
  defaultConfig as classicConfig,
} from '../src/v6-classic'
import { colors as tailwindColorsPack, defaultConfig as tailwindConfig } from '../src/v6'

describe('v6 config split: aligned base, swappable colors', () => {
  test('the aligned pieces never diverge between color packs', () => {
    expect(classicConfig.shorthands).toBe(tailwindConfig.shorthands)
    expect(classicConfig.fonts).toBe(tailwindConfig.fonts)
    expect(classicConfig.media).toBe(tailwindConfig.media)
    expect(classicConfig.settings).toBe(tailwindConfig.settings)
    for (const scale of ['space', 'size', 'radius', 'zIndex'] as const) {
      expect(classicConfig.tokens[scale]).toEqual(tailwindConfig.tokens[scale])
    }
  })

  test('both packs generate the identical theme name set and theme shape', () => {
    const tailwindNames = Object.keys(tailwindConfig.themes).sort()
    const classicNames = Object.keys(classicConfig.themes).sort()
    expect(tailwindNames).toEqual(classicNames)
    // the v5 template shape survives palette swaps
    for (const key of [
      'background',
      'color',
      'color1',
      'color12',
      'accent1',
      'shadow1',
      'border-color',
    ]) {
      expect(tailwindConfig.themes.light).toHaveProperty(key)
      expect(classicConfig.themes.light).toHaveProperty(key)
    }
  })

  test('the tailwind pack themes are generated from the Tailwind palette, not shared with v5', () => {
    expect(tailwindColorsPack.colorTokens).toHaveProperty('blue-500', '#2b7fff')
    expect(classicColors).not.toHaveProperty('colorTokens')
    // different palettes must produce different theme values
    expect(tailwindConfig.themes.light_blue.color9).not.toBe(
      classicConfig.themes.light_blue.color9
    )
    expect(tailwindConfig.themes.dark.color3).not.toBe(classicConfig.themes.dark.color3)
    // scheme-relative family ramps land in the base themes (like radix in v5)
    expect(tailwindConfig.themes.light).toHaveProperty('blue5')
    expect(tailwindConfig.themes.dark).toHaveProperty('blue5')
    expect(tailwindConfig.themes.light.blue5).not.toBe(tailwindConfig.themes.dark.blue5)
  })

  test('every palette entry produces a working createTamagui config', () => {
    const custom = createV6Config({
      themes: createTailwindThemes({
        childrenThemes: {
          blue: tailwindPalettes.blue,
          emerald: tailwindPalettes.emerald,
        },
      }),
      colorTokens: { brand: '#ff6600' },
    })

    for (const config of [tailwindConfig, classicConfig, custom]) {
      const created = createTamagui(config as any)
      expect(created.themes.light).toBeTruthy()
      expect(created.themes.dark).toBeTruthy()
      expect(created.themes.light.background).toBeTruthy()
      expect(created.tokensParsed.space['4']).toBeTruthy()
      expect(created.shorthands?.w).toBe('width')
    }
  })

  test('custom colors flow into tokens and generated themes', () => {
    const custom = createV6Config({
      themes: createTailwindThemes({
        childrenThemes: { blue: tailwindPalettes.blue },
      }),
      colorTokens: { brand: '#ff6600' },
    })
    expect(custom.tokens.color).toEqual({ brand: '#ff6600' })
    expect(custom.themes).toHaveProperty('light_blue')
    expect(custom.themes).not.toHaveProperty('light_red')
    // classic pack omits color tokens entirely (v5 behavior: colors live in themes)
    expect('color' in classicConfig.tokens).toBe(false)
    expect(baseTokens).not.toHaveProperty('color')
  })
})
