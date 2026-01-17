import { describe, expect, test, assertType } from 'vitest'
import { createV5Theme, themes as defaultThemes } from '../src/v5-themes'

describe('v5 themes', () => {
  test('default themes have expected structure', () => {
    expect(defaultThemes.light).toBeDefined()
    expect(defaultThemes.dark).toBeDefined()
    expect(defaultThemes.light_accent).toBeDefined()
    expect(defaultThemes.dark_accent).toBeDefined()
  })

  test('themes include base color tokens', () => {
    expect(defaultThemes.light.background).toBeDefined()
    expect(defaultThemes.light.color).toBeDefined()
    expect(defaultThemes.light.color1).toBeDefined()
    expect(defaultThemes.light.color12).toBeDefined()
  })

  test('themes include getTheme-computed opacity colors', () => {
    // These are computed by the getTheme callback
    expect(defaultThemes.light.color01).toBeDefined()
    expect(defaultThemes.light.color0075).toBeDefined()
    expect(defaultThemes.light.color005).toBeDefined()
    expect(defaultThemes.light.color0025).toBeDefined()
    expect(defaultThemes.light.background01).toBeDefined()
    expect(defaultThemes.light.background0075).toBeDefined()
  })

  test('themes include getTheme-computed interpolation colors', () => {
    expect(defaultThemes.light.color0pt5).toBeDefined()
    expect(defaultThemes.light.color1pt5).toBeDefined()
    expect(defaultThemes.light.color2pt5).toBeDefined()
  })

  test('themes include extra colors like shadows', () => {
    expect(defaultThemes.light.shadow1).toBeDefined()
    expect(defaultThemes.light.shadow6).toBeDefined()
    expect(defaultThemes.light.shadowColor).toBeDefined()
  })

  test('themes include whiteBlack values', () => {
    expect(defaultThemes.light.white).toBeDefined()
    expect(defaultThemes.light.black).toBeDefined()
    expect(defaultThemes.light.white02).toBeDefined()
    expect(defaultThemes.light.black02).toBeDefined()
  })

  test('createV5Theme with custom palettes', () => {
    const customThemes = createV5Theme({
      lightPalette: ['#fff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0', '#b0b0b0', '#a0a0a0', '#909090', '#808080', '#707070', '#606060', '#000'],
      darkPalette: ['#000', '#101010', '#202020', '#303030', '#404040', '#505050', '#606060', '#707070', '#808080', '#909090', '#a0a0a0', '#fff'],
    })

    expect(customThemes.light).toBeDefined()
    expect(customThemes.dark).toBeDefined()
    expect(customThemes.light.background).toBeDefined()
  })

  test('createV5Theme with includeDefaultColors: false', () => {
    const minimalThemes = createV5Theme({
      includeDefaultColors: false,
    })

    expect(minimalThemes.light).toBeDefined()
    expect(minimalThemes.dark).toBeDefined()
    // Should still have accent themes
    expect(minimalThemes.light_accent).toBeDefined()
    expect(minimalThemes.dark_accent).toBeDefined()
    // Should still have black/white children
    expect(minimalThemes.light_black).toBeDefined()
    expect(minimalThemes.light_white).toBeDefined()
  })

  test('createV5Theme with componentThemes: false', () => {
    const noComponentThemes = createV5Theme({
      componentThemes: false,
    })

    expect(noComponentThemes.light).toBeDefined()
    expect(noComponentThemes.dark).toBeDefined()
  })

  test('createV5Theme with custom colors', () => {
    const themesWithBrand = createV5Theme({
      colors: {
        brand: {
          light: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#004d40', '#00251a'],
          dark: ['#00251a', '#004d40', '#006064', '#00838f', '#0097a7', '#00acc1', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa'],
        },
      },
    })

    expect(themesWithBrand.light).toBeDefined()
    expect(themesWithBrand.light_brand).toBeDefined()
    expect(themesWithBrand.dark_brand).toBeDefined()
  })

  test('createV5Theme with custom grandChildrenThemes', () => {
    const themesWithCustomGrandChildren = createV5Theme({
      grandChildrenThemes: {
        dim: { template: 'alt1' },
        bright: { template: 'alt2' },
      },
    })

    expect(themesWithCustomGrandChildren.light).toBeDefined()
    // Default grandchildren should still work
    expect(themesWithCustomGrandChildren.light_accent).toBeDefined()
    // Custom grandchildren should be created
    expect(themesWithCustomGrandChildren.light_blue_dim).toBeDefined()
    expect(themesWithCustomGrandChildren.light_blue_bright).toBeDefined()
  })

  test('color themes have proper palette values', () => {
    // Blue should have blue colors
    expect(defaultThemes.light_blue).toBeDefined()
    expect(defaultThemes.dark_blue).toBeDefined()

    // Red should have red colors
    expect(defaultThemes.light_red).toBeDefined()
    expect(defaultThemes.dark_red).toBeDefined()

    // Other default colors
    expect(defaultThemes.light_green).toBeDefined()
    expect(defaultThemes.light_yellow).toBeDefined()
    expect(defaultThemes.light_gray).toBeDefined()
    expect(defaultThemes.light_neutral).toBeDefined()
  })

  test('accent themes inherit properly', () => {
    // Accent themes should have inverted values
    expect(defaultThemes.light_accent).toBeDefined()
    expect(defaultThemes.dark_accent).toBeDefined()

    // Accent should have different background than base
    expect(defaultThemes.light_accent.background).not.toBe(defaultThemes.light.background)
  })
})

// Type-level tests
describe('v5 theme types', () => {
  test('type inference works for default themes', () => {
    // These assertions verify at compile time that the types are correct
    const light = defaultThemes.light

    // Should have theme tokens
    assertType<string>(light.background)
    assertType<string>(light.color)

    // Should have getTheme-computed values
    assertType<string>(light.color01)
    assertType<string>(light.background01)
    assertType<string>(light.color0pt5)
  })

  test('type inference works for custom themes', () => {
    const customThemes = createV5Theme({
      includeDefaultColors: false,
    })

    // Should still have proper types
    assertType<string>(customThemes.light.background)
    assertType<string>(customThemes.light.color)
  })
})
