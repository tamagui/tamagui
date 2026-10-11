import { describe, expect, test } from 'bun:test'

import {
  createPaletteThemes,
  fromShades,
  paletteTokens,
  ramp,
  raise,
  scales,
  themes as authoredThemes,
} from '../src/builder'
import { themes } from '../src/generated'
import { tokens } from '../src/tokens'

describe('v6 themes', () => {
  test('the static output matches the authored tree', () => {
    expect(themes).toEqual(authoredThemes)
    expect(Object.keys(themes)).toHaveLength(212)
    expect(new Set(Object.values(themes)).size).toBe(40)
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

  // brand is the emphasis flip of whatever it sits on: a checked checkbox,
  // an "on" toggle, a tooltip. it resolves to the same theme as `inverse`,
  // and levels nest under it the same way.
  test('brand flips the scheme like inverse', () => {
    expect(themes.light_brand).toBe(themes.dark)
    expect(themes.dark_brand).toBe(themes.light)
    expect(themes.light_brand_level2).toBe(themes.dark_level2)
    expect(themes.dark_brand_level4).toBe(themes.light_level4)
  })

  test('active is one rung lighter with hover and press pinned to resting', () => {
    const { light_active, dark_active } = themes
    // one rung toward white from the resting background, in both schemes
    expect(light_active.background).toBe(tokens.color['white'])
    expect(light_active.background).toBe(themes.light['background-active'])
    expect(dark_active.background).toBe(tokens.color['mauve-900'])
    expect(dark_active.background).toBe(themes.dark['background-active'])
    // no hover or press state: every shift resolves to the resting value
    for (const theme of [light_active, dark_active]) {
      expect(theme['background-hover']).toBe(theme.background)
      expect(theme['background-press']).toBe(theme.background)
      expect(theme['background-focus']).toBe(theme.background)
      expect(theme['border-color-hover']).toBe(theme['border-color'])
      expect(theme['border-color-press']).toBe(theme['border-color'])
      expect(theme['border-color-focus']).toBe(theme['border-color'])
      expect(theme['color-hover']).toBe(theme.color)
      expect(theme['color-press']).toBe(theme.color)
      expect(theme['color-focus']).toBe(theme.color)
    }
    // the ramp stays absolute: active moves the ground, not the ladder
    expect(light_active['color-1']).toBe(themes.light['color-1'])
    expect(light_active['color-11']).toBe(themes.light['color-11'])
    expect(dark_active['color-1']).toBe(themes.dark['color-1'])
    expect(dark_active['color-11']).toBe(themes.dark['color-11'])
    // the marker survives nesting: anything under an active theme stays active
    expect(themes.light_active_level2.background).toBe(tokens.color['mauve-50'])
    expect(themes.light_active_level2['background-press']).toBe(tokens.color['mauve-50'])
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
    expect(themes.light_brand['color-1']).toBe(tokens.color['mauve-950'])
    expect(themes.light_brand['color-11']).toBe(tokens.color['mauve-50'])
    expect(fromShades('red', scales.tint.light[1]).background).toBe('red-100')
    expect(themes.light_red_level2.background).toBe(tokens.color['red-200'])
  })

  test('raises only background and border shade families and clamps endpoints', () => {
    const raised = raise(scales.normal.light[1], 20)
    expect(raised.background).toBe('black')
    expect(raised['background-active']).toBe('black')
    expect(raised['border-color']).toBe('black')
    expect(raised.color).toBe(950)
    expect(raised['shadow-color']).toBe('shadow-3')
    expect(raised['accent-background']).toBe('brand-600')
    // the active rung walks with the background, so levels keep the same
    // one-rung relationship as their base
    expect(raise(scales.normal.light[1], 1)['background-active']).toBe(50)
    expect(raise(scales.normal.dark[1], -1)['background-active']).toBe(800)
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
      // selected surfaces pin every shift to resting by design, so they are
      // exempt from the lift/push rule and assert the pin instead
      if (name.includes('active')) {
        if (theme['background-hover'] !== theme.background) {
          wrong.push(`${name} hover ${theme.background} -> ${theme['background-hover']}`)
        }
        if (theme['background-press'] !== theme.background) {
          wrong.push(`${name} press ${theme.background} -> ${theme['background-press']}`)
        }
        continue
      }
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

  // a palette ramp runs from 50 (palest) to 950 (deepest); dark reads it in
  // reverse, so one ramp per palette covers both schemes
  const surface = [
    '#fbf7f2',
    '#f3ebe0',
    '#e6d8c6',
    '#d6c1a6',
    '#c0a583',
    '#a48861',
    '#866c48',
    '#66513a',
    '#4e3f30',
    '#382d24',
    '#1c1610',
  ] as const
  const copper = [
    'hsla(40, 61%, 95%, 1)',
    'hsla(40, 67%, 90%, 1)',
    'hsla(40, 74%, 84%, 1)',
    'hsla(40, 78%, 77%, 1)',
    'hsla(40, 83%, 70%, 1)',
    'hsla(40, 87%, 60%, 1)',
    'hsla(40, 90%, 47%, 1)',
    'hsla(36, 80%, 36%, 1)',
    'hsla(31, 65%, 28%, 1)',
    'hsla(27, 60%, 19%, 1)',
    'hsla(24, 65%, 10%, 1)',
  ] as const
  const indigo = [
    '#eef2ff',
    '#e0e7ff',
    '#c6d2ff',
    '#a3b3ff',
    '#7c86ff',
    '#615fff',
    '#4f39f6',
    '#432dd7',
    '#372aac',
    '#312c85',
    '#1e1a4d',
  ] as const

  test('palette tokens name every shade and refuse a short ramp', () => {
    expect(paletteTokens({ brand: indigo })['brand-50']).toBe('#eef2ff')
    expect(paletteTokens({ brand: indigo })['brand-950']).toBe('#1e1a4d')
    expect(() => paletteTokens({ brand: indigo.slice(1) })).toThrow(
      'palette "brand" needs 11 colors'
    )
  })

  test('palette themes ground on the surface ramp and derive the accent from brand', () => {
    const { colorTokens, themes: palette } = createPaletteThemes({
      surface,
      brand: indigo,
      moss: surface,
    })
    expect(colorTokens['surface-50']).toBe(surface[0])
    expect(colorTokens['moss-500']).toBe(surface[5])
    expect(colorTokens['mauve-50']).toBe(tokens.color['mauve-50'])
    expect(Object.keys(palette).sort()).toEqual(Object.keys(themes).sort())
    expect(palette.light.background).toBe(surface[0])
    expect(palette.light['background-hover']).toBe(tokens.color.white)
    expect(palette.light.color).toBe(surface[10])
    expect(palette.light['color-1']).toBe(surface[0])
    expect(palette.dark.background).toBe(surface[10])
    expect(palette.dark['color-1']).toBe(surface[10])
    expect(palette.dark.color).toBe(surface[0])
    expect(palette.dark_level2.background).toBe(surface[9])
    expect(palette.light['accent-background']).toBe(indigo[6])
    expect(palette.light['accent-color']).toBe(indigo[0])
    expect(palette.light_accent.background).toBe(indigo[1])
    expect(palette.light_accent.color).toBe(indigo[7])
    // a brand ramp redefines the emphasis surface as the solid brand fill
    expect(palette.light_brand.background).toBe(indigo[6])
    expect(palette.light_brand.color).toBe(indigo[0])
    expect(palette.dark_brand.background).toBe(indigo[5])
    expect(palette.light_inverse).toBe(palette.dark)
  })

  test('palette themes keep the default ground and emphasis without those ramps', () => {
    const { themes: palette } = createPaletteThemes({ moss: surface })
    expect(palette.light).toEqual(themes.light)
    expect(palette.light_brand).toBe(palette.dark)
  })

  // copper-600 is a bright penny: white type cannot read on it, so the bold
  // surface and the accent pair flip to the deep end of the same ramp. the
  // tint keeps its 700 type, which already reads on the 100 tint.
  test('a pale brand carries deep type on its fill', () => {
    const { colorTokens, themes: palette } = createPaletteThemes({ brand: copper })
    expect(palette.light['accent-background']).toBe(copper[6])
    expect(palette.light['accent-color']).toBe(copper[10])
    expect(palette.light_brand.color).toBe(copper[10])
    expect(palette.light_brand['color-hover']).toBe(copper[10])
    expect(palette.light_brand.background).toBe(copper[6])
    expect(palette.dark_brand.color).toBe(copper[10])
    expect(palette.light_accent.color).toBe(copper[7])
    expect(colorTokens['brand-600']).toBe(copper[6])
  })
})
