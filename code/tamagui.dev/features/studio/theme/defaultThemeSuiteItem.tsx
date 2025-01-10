import { defaultBaseTheme } from './defaultBaseTheme'
import { defaultPalettes } from './defaultPalettes'
import type { ThemeSuiteItemData } from './types'
import { defaultComponentThemes, defaultTemplates } from '@tamagui/themes/v3-themes'

export const defaultSelectedSchemes = {
  dark: true,
  light: true,
}

export const defaultThemeSuiteItem = {
  name: '',
  baseTheme: defaultBaseTheme,
  subThemes: [],
  componentThemes: defaultComponentThemes,
  palettes: defaultPalettes,
  templates: defaultTemplates,
  schemes: defaultSelectedSchemes,
} satisfies ThemeSuiteItemData
