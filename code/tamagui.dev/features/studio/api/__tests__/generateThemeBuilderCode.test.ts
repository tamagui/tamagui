import { describe, expect, it } from 'vitest'

import { defaultPalettes } from '../../theme/defaultPalettes'
import {
  createStudioThemes,
  getStudioThemeTokens,
  getThemeSuitePalettes,
} from '../../theme/palettes'
import { generateThemeBuilderCode } from '../generateThemeBuilderCode'

describe('studio v6 themes', () => {
  const themeSuite = {
    name: 'test',
    palettes: defaultPalettes,
    schemes: { light: true, dark: true },
  }

  it('builds exactly 11 adaptive shades in both schemes', () => {
    const palettes = getThemeSuitePalettes(defaultPalettes.base)
    expect(palettes.light).toHaveLength(11)
    expect(palettes.dark).toHaveLength(11)

    const tokens = getStudioThemeTokens(defaultPalettes)
    expect(Object.keys(tokens)).toHaveLength(44)
    expect(tokens['base-light-50']).toBe(palettes.light[0])
    expect(tokens['base-dark-950']).toBe(palettes.dark[0])
  })

  it('creates recipe levels and accent themes from the edited palettes', () => {
    const { themes } = createStudioThemes(themeSuite)
    expect(themes.light.color1).toBe(getThemeSuitePalettes(defaultPalettes.base).light[0])
    expect(themes.dark.color1).toBe(getThemeSuitePalettes(defaultPalettes.base).dark[0])
    expect(themes.light_level2).toBeDefined()
    expect(themes.light_accent_level2).toBeDefined()
    expect(themes.light_inverse).toBe(themes.dark)
  })

  it('exports a scales and tree module using the v6 generator', async () => {
    const code = await generateThemeBuilderCode(themeSuite)
    expect(code).toContain("from '@tamagui/themes/builder'")
    expect(code).toContain('export const scales =')
    expect(code).toContain('export const tree =')
    expect(code).toContain('createThemes(tokens, tree, { getTheme })')
  })
})
