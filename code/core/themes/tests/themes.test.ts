import { describe, expect, test } from 'bun:test'

import { fromShades, ramp, raise, scales, themes as authoredThemes } from '../src/builder'
import { themes } from '../src/generated'
import { tokens } from '../src/tokens'

describe('v6 themes', () => {
  test('the static output matches the authored tree', () => {
    expect(themes).toEqual(authoredThemes)
    expect(Object.keys(themes)).toHaveLength(128)
    expect(new Set(Object.values(themes)).size).toBe(36)
  })

  test('resolves relative levels and saturated aliases', () => {
    expect(themes.light_level2_level2).toBe(themes.light_level3)
    expect(themes.light_level2_level2_level2).toBe(themes.light_level4)
    expect(themes.dark_level3_level2).toBe(themes.dark_level4)
    expect(themes.light_red_level2).not.toBe(themes.light_red)
    expect(themes.light_red_level3).toBe(themes.light_red_level2)
    expect(themes.light_red_level4).toBe(themes.light_red_level2)
  })

  test('deduplicates inverse themes against the opposite recipe scheme', () => {
    expect(themes.light_inverse).toBe(themes.dark)
    expect(themes.light_inverse_level2).toBe(themes.dark_level2)
    expect(themes.dark_inverse).toBe(themes.light)
    expect(themes.dark_inverse_level4).toBe(themes.light_level4)
  })

  test('maps ramps and shades to token values without interpolation', () => {
    expect(ramp('red', 'light')).toEqual({
      color1: 'red-50',
      color2: 'red-100',
      color3: 'red-200',
      color4: 'red-300',
      color5: 'red-400',
      color6: 'red-500',
      color7: 'red-600',
      color8: 'red-700',
      color9: 'red-800',
      color10: 'red-900',
      color11: 'red-950',
    })
    expect(ramp('red', 'dark').color1).toBe('red-950')
    expect(fromShades('red', scales.tint.light[1]).background).toBe('red-100')
    expect(themes.light_red_level2.background).toBe(tokens.color['red-50'])
  })

  test('raises only background and border shade families and clamps endpoints', () => {
    const raised = raise(scales.normal.light[1], 20)
    expect(raised.background).toBe('black')
    expect(raised['border-color']).toBe('black')
    expect(raised.color).toBe(950)
    expect(raised['shadow-color']).toBe('shadow-3')
    expect(raised['accent-background']).toBe('brand-600')
  })
})
