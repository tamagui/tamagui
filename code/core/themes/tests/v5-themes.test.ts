import { describe, expect, test, assertType } from 'vitest'
import {
  createV5Theme,
  themes as defaultThemes,
  defaultChildrenThemes,
} from '../src/v5-themes'
import { opacify, interpolateColor } from '../src/opacify'

describe('opacify', () => {
  test('converts hex to hex with alpha', () => {
    expect(opacify('#ff0000', 0.5)).toBe('#ff000080')
    expect(opacify('#fff', 0.25)).toBe('#ffffff40') // shorthand
  })

  test('converts hsl to hsla', () => {
    expect(opacify('hsl(0, 100%, 50%)', 0.5)).toBe('hsla(0, 100%, 50%, 0.5)')
  })

  test('returns unsupported formats unchanged', () => {
    expect(opacify('rgb(255, 0, 0)', 0.5)).toBe('rgb(255, 0, 0)')
    expect(opacify('invalid', 0.5)).toBe('invalid')
  })
})

describe('interpolateColor', () => {
  test('interpolates between colors', () => {
    expect(interpolateColor('#000000', '#ffffff', 0)).toBe('rgb(0, 0, 0)')
    expect(interpolateColor('#000000', '#ffffff', 1)).toBe('rgb(255, 255, 255)')
    expect(interpolateColor('#000000', '#ffffff', 0.5)).toBe('rgb(128, 128, 128)')
  })

  test('handles different color formats', () => {
    expect(interpolateColor('rgb(0, 0, 0)', 'rgb(255, 255, 255)', 0.5)).toBe(
      'rgb(128, 128, 128)'
    )
    expect(interpolateColor('hsl(0, 100%, 50%)', 'hsl(0, 100%, 100%)', 0.5)).toMatch(
      /^rgb/
    )
  })

  test('returns first color on invalid input', () => {
    expect(interpolateColor('#ff0000', 'invalid', 0.5)).toBe('#ff0000')
  })
})

describe('v5 themes', () => {
  test('generates expected theme structure', () => {
    const keys = Object.keys(defaultThemes)

    // Base + accent
    expect(keys).toContain('light')
    expect(keys).toContain('dark')
    expect(keys).toContain('light_accent')

    // Children themes
    expect(keys).toContain('light_blue')
    expect(keys).toContain('dark_red')
  })

  test('light and dark themes have different values', () => {
    expect(defaultThemes.light.background).not.toBe(defaultThemes.dark.background)
    expect(defaultThemes.light.color).not.toBe(defaultThemes.dark.color)
  })

  test('accent themes are inverted', () => {
    expect(defaultThemes.light.background).not.toBe(defaultThemes.light_accent.background)
    expect(defaultThemes.dark.background).not.toBe(defaultThemes.dark_accent.background)
  })

  test('getTheme computes opacity and interpolation colors', () => {
    // Opacity variants
    expect(defaultThemes.light.color01).toBeDefined()
    expect(defaultThemes.light.background01).toBeDefined()
    expect(defaultThemes.light.background08).toBeDefined()
    expect(defaultThemes.light.outlineColor).toBeDefined()

    // Works on all theme types
    expect(defaultThemes.light_blue.color01).toBeDefined()
  })

  test('children colors spread to base theme extras', () => {
    expect(defaultThemes.light.blue1).toBe(defaultChildrenThemes.blue.light.blue1)
    expect(defaultThemes.light.blue12).toBe(defaultChildrenThemes.blue.light.blue12)
    expect(defaultThemes.dark.blue1).toBe(defaultChildrenThemes.blue.dark.blue1)
  })

  test('includes shadow and whiteBlack colors', () => {
    expect(defaultThemes.light.shadow1).toBeDefined()
    expect(defaultThemes.light.shadow6).toBeDefined()
    expect(defaultThemes.light.white).toBe('rgba(255,255,255,1)')
    expect(defaultThemes.light.black).toBe('rgba(0,0,0,1)')
  })

  test('has color1-12 and accent1-12 tokens', () => {
    expect(defaultThemes.light.color1).toBeDefined()
    expect(defaultThemes.light.color12).toBeDefined()
    expect(defaultThemes.light.accent1).toBeDefined()
    expect(defaultThemes.light.accent12).toBeDefined()
  })
})

describe('createV5Theme options', () => {
  test('custom palettes affect black/white colors', () => {
    const themes = createV5Theme({
      darkPalette: [
        '#111',
        '#222',
        '#333',
        '#444',
        '#555',
        '#666',
        '#777',
        '#888',
        '#999',
        '#aaa',
        '#bbb',
        '#ccc',
      ],
    })
    expect(themes.light.black1).toBe('#111')
    expect(themes.light.black12).toBe('#ccc')
  })

  test('componentThemes: false removes component themes', () => {
    const themes = createV5Theme({ componentThemes: false })
    const keys = Object.keys(themes)
    expect(keys.filter((k) => k.includes('Button'))).toHaveLength(0)
  })

  test('empty childrenThemes produces minimal themes', () => {
    const themes = createV5Theme({ childrenThemes: {} })
    const keys = Object.keys(themes)
    expect(keys).toContain('light')
    expect(keys).toContain('light_black') // internal
    expect(keys).not.toContain('light_blue')
  })

  test('custom childrenThemes adds color themes', () => {
    const themes = createV5Theme({
      childrenThemes: {
        brand: {
          light: { brand1: '#e0f7fa', brand12: '#00251a' },
          dark: { brand1: '#00251a', brand12: '#e0f7fa' },
        },
      },
    })
    expect(themes.light.brand1).toBe('#e0f7fa')
    expect(themes.dark.brand1).toBe('#00251a')
  })

  test('grandChildrenThemes override defaults', () => {
    const themes = createV5Theme({
      grandChildrenThemes: { custom: { template: 'surface1' } },
    })
    const keys = Object.keys(themes)
    expect(keys).toContain('light_blue_custom')
    expect(keys).not.toContain('light_blue_accent')
  })
})

describe('defaultChildrenThemes', () => {
  test('has expected structure', () => {
    expect(Object.keys(defaultChildrenThemes.blue.light)).toHaveLength(12)
    expect(defaultChildrenThemes.neutral.light).toEqual(
      defaultChildrenThemes.neutral.dark
    )
  })
})

describe('type safety', () => {
  test('theme values are string | number', () => {
    assertType<string | number>(defaultThemes.light.background)
    assertType<string | number>(defaultThemes.light.color01)
    assertType<string | number>(defaultThemes.light.blue1)
  })

  test('custom themes infer types correctly', () => {
    const themes = createV5Theme({
      childrenThemes: {
        brand: {
          light: { brand1: '#fff', brand12: '#000' },
          dark: { brand1: '#000', brand12: '#fff' },
        },
      },
    })
    // brand colors should be typed
    assertType<string | number>(themes.light.brand1)
  })
})
