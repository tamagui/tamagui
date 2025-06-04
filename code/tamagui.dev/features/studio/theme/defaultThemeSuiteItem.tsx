import { defaultPalettes } from './defaultPalettes'
import type { ThemeSuiteItemData } from './types'

export const defaultSelectedSchemes = {
  dark: true,
  light: true,
}

export const defaultThemeSuiteItem = {
  name: '',
  palettes: defaultPalettes,
  schemes: defaultSelectedSchemes,
} satisfies ThemeSuiteItemData
