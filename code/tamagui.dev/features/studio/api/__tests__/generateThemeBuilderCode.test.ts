import { describe, it, expect } from 'vitest'
import { generateThemeBuilderCode } from '../generateThemeBuilderCode'
import { defaultPalettes } from '../../theme/defaultPalettes'

describe('generateThemeBuilderCode', () => {
  const mockPalettes = {
    base: defaultPalettes.base,
    accent: defaultPalettes.accent,
  }

  it('generates v5 theme code with createV5Theme', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    // Should use v5 API
    expect(code).toContain('import { createV5Theme')
    expect(code).toContain("from '@tamagui/config/v5'")
    expect(code).toContain('createV5Theme({')
  })

  it('includes darkPalette and lightPalette', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    expect(code).toContain('const darkPalette = [')
    expect(code).toContain('const lightPalette = [')
    expect(code).toContain('darkPalette,')
    expect(code).toContain('lightPalette,')
  })

  it('includes custom accent as top-level option', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    // Accent should be a top-level option with named colors
    expect(code).toContain('const accentLight = {')
    expect(code).toContain('const accentDark = {')
    expect(code).toContain('"accent1":')
    expect(code).toContain('"accent12":')
    expect(code).toContain('accent: {')
    expect(code).toContain('light: accentLight,')
    expect(code).toContain('dark: accentDark,')
  })

  it('includes semantic color themes (warning, error, success)', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    // Should import Radix colors
    expect(code).toContain(
      "import { yellow, yellowDark, red, redDark, green, greenDark } from '@tamagui/colors'"
    )

    // Should include semantic themes
    expect(code).toContain('warning: {')
    expect(code).toContain('light: yellow,')
    expect(code).toContain('dark: yellowDark,')

    expect(code).toContain('error: {')
    expect(code).toContain('light: red,')
    expect(code).toContain('dark: redDark,')

    expect(code).toContain('success: {')
    expect(code).toContain('light: green,')
    expect(code).toContain('dark: greenDark,')
  })

  it('includes defaultChildrenThemes spread', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    expect(code).toContain('...defaultChildrenThemes,')
  })

  it('includes componentThemes when enabled', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: true,
      includeSizeTokens: false,
    })

    expect(code).toContain('v5ComponentThemes')
    expect(code).toContain('componentThemes: v5ComponentThemes,')
  })

  it('disables componentThemes when not enabled', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    expect(code).toContain('componentThemes: false,')
    expect(code).not.toContain('v5ComponentThemes')
  })

  it('exports themes type and conditional themes', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    expect(code).toContain('export type Themes = typeof builtThemes')
    expect(code).toContain('export const themes: Themes =')
    expect(code).toContain("process.env.TAMAGUI_ENVIRONMENT === 'client'")
  })

  it('generates valid palette arrays with 12 colors', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    // Extract darkPalette array from generated code
    const darkPaletteMatch = code.match(/const darkPalette = \[(.*?)\]/s)
    expect(darkPaletteMatch).toBeTruthy()

    // Count quoted color strings (handles hsla with commas inside)
    const darkColors = darkPaletteMatch![1].match(/'[^']+'/g)
    expect(darkColors).toBeTruthy()
    expect(darkColors!.length).toBe(12)

    // Extract lightPalette array from generated code
    const lightPaletteMatch = code.match(/const lightPalette = \[(.*?)\]/s)
    expect(lightPaletteMatch).toBeTruthy()

    const lightColors = lightPaletteMatch![1].match(/'[^']+'/g)
    expect(lightColors).toBeTruthy()
    expect(lightColors!.length).toBe(12)
  })

  it('generates accent colors with 12 named values', async () => {
    const code = await generateThemeBuilderCode({
      palettes: mockPalettes,
      includeComponentThemes: false,
      includeSizeTokens: false,
    })

    // Check accent has all 12 colors
    for (let i = 1; i <= 12; i++) {
      expect(code).toContain(`"accent${i}":`)
    }
  })
})
