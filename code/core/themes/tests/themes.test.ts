import { describe, expect, test } from 'bun:test'

import { fromShades, ramp, raise, scales, themes as authoredThemes } from '../src/builder'
import { themes } from '../src/generated'
import { tokens } from '../src/tokens'

describe('v6 themes', () => {
  test('the static output matches the authored tree', () => {
    expect(themes).toEqual(authoredThemes)
    expect(Object.keys(themes)).toHaveLength(162)
    expect(new Set(Object.values(themes)).size).toBe(34)
  })

  // black and white pin a scheme outright where `inverse` only flips whatever
  // the parent was, so a subtree that cannot know which scheme it is mounted
  // under can still ask for one. v6 authored its recipe tree from scratch and
  // dropped both, which left <Theme name="black"> resolving to nothing and
  // silently rendering in the parent theme. every name they add deduplicates
  // onto a theme that already existed, so they cost selectors and no values.
  test('black and white name a scheme outright, from either parent', () => {
    expect(themes.light_black).toBe(themes.dark)
    expect(themes.dark_black).toBe(themes.dark)
    expect(themes.light_white).toBe(themes.light)
    expect(themes.dark_white).toBe(themes.light)
    expect(themes.light_black_level2).toBe(themes.dark_level2)
    expect(themes.dark_white_level3).toBe(themes.light_level3)
  })

  test('resolves relative levels and saturated aliases', () => {
    expect(themes.light_level2_level2).toBe(themes.light_level3)
    expect(themes.light_level2_level2_level2).toBe(themes.light_level4)
    expect(themes.dark_level3_level2).toBe(themes.dark_level4)
    expect(themes.light_red_level2).not.toBe(themes.light_red)
    expect(themes.light_red_level3).not.toBe(themes.light_red_level2)
    // tint tops out at three: a fourth step drops the type under 4.5:1
    expect(themes.light_red_level4).toBe(themes.light_red_level3)
  })

  test('brand does not nest', () => {
    expect(themes.light_brand).toBeDefined()
    expect('light_brand_level2' in themes).toBe(false)
    expect('dark_brand_level2' in themes).toBe(false)
  })

  test('deduplicates inverse themes against the opposite recipe scheme', () => {
    expect(themes.light_inverse).toBe(themes.dark)
    expect(themes.light_inverse_level2).toBe(themes.dark_level2)
    expect(themes.dark_inverse).toBe(themes.light)
    expect(themes.dark_inverse_level4).toBe(themes.light_level4)
  })

  test('maps ramps and shades to token values without interpolation', () => {
    expect(ramp('red', 'light')).toEqual({
      'color-1': 'red-50',
      'color-2': 'red-100',
      'color-3': 'red-200',
      'color-4': 'red-300',
      'color-5': 'red-400',
      'color-6': 'red-500',
      'color-7': 'red-600',
      'color-8': 'red-700',
      'color-9': 'red-800',
      'color-10': 'red-900',
      'color-11': 'red-950',
    })
    expect(ramp('red', 'dark')['color-1']).toBe('red-950')
    // a bold light scale paints deep under pale type, so its ramp runs deep to pale
    expect(ramp('brand', 'light', scales.bold.light[1])['color-1']).toBe('brand-950')
    expect(ramp('brand', 'light', scales.tint.light[1])['color-1']).toBe('brand-50')
    expect(ramp('brand', 'dark', scales.bold.dark[1])['color-1']).toBe('brand-950')
    expect(themes.light_brand['color-1']).toBe(tokens.color['brand-950'])
    expect(themes.light_brand['color-11']).toBe(tokens.color['brand-50'])
    expect(fromShades('red', scales.tint.light[1]).background).toBe('red-100')
    expect(themes.light_red_level2.background).toBe(tokens.color['red-200'])
  })

  test('raises only background and border shade families and clamps endpoints', () => {
    const raised = raise(scales.normal.light[1], 20)
    expect(raised.background).toBe('black')
    expect(raised['border-color']).toBe('black')
    expect(raised.color).toBe(950)
    expect(raised['shadow-color']).toBe('shadow-3')
    expect(raised['accent-background']).toBe('brand-600')
  })

  // a hover is a lift and a press is a push, in both schemes. this held backwards
  // for every light theme once, because the direction is authored on each base
  // scale and `raise` carries whatever relationship that scale had into all of its
  // levels, so one wrong base silently pointed 26 themes the wrong way.
  test('hover always lifts and press always pushes, in every theme', () => {
    const lightness = (hex: string) => {
      const channels = [1, 3, 5]
        .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      const y = 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
      return y <= 216 / 24389 ? (y * 24389) / 27 : Math.cbrt(y) * 116 - 16
    }

    const wrong: string[] = []
    for (const [name, theme] of Object.entries(themes)) {
      const base = lightness(theme.background)
      if (lightness(theme['background-hover']) <= base) {
        wrong.push(`${name} hover ${theme.background} -> ${theme['background-hover']}`)
      }
      if (lightness(theme['background-press']) >= base) {
        wrong.push(`${name} press ${theme.background} -> ${theme['background-press']}`)
      }
    }
    expect(wrong).toEqual([])
  })
})
