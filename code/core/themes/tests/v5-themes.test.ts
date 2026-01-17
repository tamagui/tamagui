import { describe, expect, test, assertType } from 'vitest'
import {
  createV5Theme,
  themes as defaultThemes,
  defaultChildrenThemes,
  defaultGrandChildrenThemes,
} from '../src/v5-themes'

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
      lightPalette: [
        '#fff',
        '#f0f0f0',
        '#e0e0e0',
        '#d0d0d0',
        '#c0c0c0',
        '#b0b0b0',
        '#a0a0a0',
        '#909090',
        '#808080',
        '#707070',
        '#606060',
        '#000',
      ],
      darkPalette: [
        '#000',
        '#101010',
        '#202020',
        '#303030',
        '#404040',
        '#505050',
        '#606060',
        '#707070',
        '#808080',
        '#909090',
        '#a0a0a0',
        '#fff',
      ],
    })

    expect(customThemes.light).toBeDefined()
    expect(customThemes.dark).toBeDefined()
    expect(customThemes.light.background).toBeDefined()
  })

  test('createV5Theme with empty childrenThemes (no color themes)', () => {
    const minimalThemes = createV5Theme({
      childrenThemes: {},
    })

    expect(minimalThemes.light).toBeDefined()
    expect(minimalThemes.dark).toBeDefined()
    // Should still have accent themes
    expect(minimalThemes.light_accent).toBeDefined()
    expect(minimalThemes.dark_accent).toBeDefined()
  })

  test('createV5Theme with componentThemes: false', () => {
    const noComponentThemes = createV5Theme({
      componentThemes: false,
    })

    expect(noComponentThemes.light).toBeDefined()
    expect(noComponentThemes.dark).toBeDefined()
  })

  test('createV5Theme with custom childrenThemes', () => {
    const themesWithBrand = createV5Theme({
      childrenThemes: {
        ...defaultChildrenThemes,
        brand: {
          palette: {
            light: [
              '#e0f7fa',
              '#b2ebf2',
              '#80deea',
              '#4dd0e1',
              '#26c6da',
              '#00bcd4',
              '#00acc1',
              '#0097a7',
              '#00838f',
              '#006064',
              '#004d40',
              '#00251a',
            ],
            dark: [
              '#00251a',
              '#004d40',
              '#006064',
              '#00838f',
              '#0097a7',
              '#00acc1',
              '#00bcd4',
              '#26c6da',
              '#4dd0e1',
              '#80deea',
              '#b2ebf2',
              '#e0f7fa',
            ],
          },
        },
      },
    })

    expect(themesWithBrand.light).toBeDefined()
    // Brand named colors should be in extra
    expect(themesWithBrand.light.brand1).toBeDefined()
    expect(themesWithBrand.light.brand12).toBeDefined()
  })

  test('createV5Theme with custom grandChildrenThemes', () => {
    const themesWithCustomGrandChildren = createV5Theme({
      grandChildrenThemes: {
        ...defaultGrandChildrenThemes,
        dim: { template: 'alt1' },
        bright: { template: 'alt2' },
      },
    })

    expect(themesWithCustomGrandChildren.light).toBeDefined()
    // Default grandchildren should still work
    expect(themesWithCustomGrandChildren.light_accent).toBeDefined()
  })

  test('auto-generated extra colors from childrenThemes', () => {
    // The default themes should have blue1-12, red1-12, etc. from defaultChildrenThemes
    expect(defaultThemes.light.blue1).toBeDefined()
    expect(defaultThemes.light.blue12).toBeDefined()
    expect(defaultThemes.light.red1).toBeDefined()
    expect(defaultThemes.light.red12).toBeDefined()
    expect(defaultThemes.light.green1).toBeDefined()
    expect(defaultThemes.light.yellow1).toBeDefined()
    expect(defaultThemes.light.gray1).toBeDefined()
    expect(defaultThemes.light.neutral1).toBeDefined()
  })

  test('accent themes inherit properly', () => {
    // Accent themes should have inverted values
    expect(defaultThemes.light_accent).toBeDefined()
    expect(defaultThemes.dark_accent).toBeDefined()

    // Accent should have different background than base
    expect(defaultThemes.light_accent.background).not.toBe(defaultThemes.light.background)
  })

  test('defaultChildrenThemes exports expected colors', () => {
    expect(defaultChildrenThemes.blue).toBeDefined()
    expect(defaultChildrenThemes.red).toBeDefined()
    expect(defaultChildrenThemes.green).toBeDefined()
    expect(defaultChildrenThemes.yellow).toBeDefined()
    expect(defaultChildrenThemes.gray).toBeDefined()
    expect(defaultChildrenThemes.neutral).toBeDefined()
    expect(defaultChildrenThemes.black).toBeDefined()
    expect(defaultChildrenThemes.white).toBeDefined()
  })

  test('defaultGrandChildrenThemes exports expected themes', () => {
    expect(defaultGrandChildrenThemes.accent).toBeDefined()
    expect(defaultGrandChildrenThemes.alt1).toBeDefined()
    expect(defaultGrandChildrenThemes.alt2).toBeDefined()
    expect(defaultGrandChildrenThemes.surface1).toBeDefined()
    expect(defaultGrandChildrenThemes.surface2).toBeDefined()
    expect(defaultGrandChildrenThemes.surface3).toBeDefined()
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
      childrenThemes: {},
    })

    // Should still have proper types
    assertType<string>(customThemes.light.background)
    assertType<string>(customThemes.light.color)
  })
})
