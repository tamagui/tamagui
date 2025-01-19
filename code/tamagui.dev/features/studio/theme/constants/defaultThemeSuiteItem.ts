import type { ThemeSuiteItemData } from '../types'
import { defaultPalettes } from './defaultPalettes'

export const defaultSelectedSchemes = {
  dark: true,
  light: true,
}

export const defaultThemeSuiteItem = {
  name: '',
  palettes: defaultPalettes,
  schemes: defaultSelectedSchemes,
} satisfies ThemeSuiteItemData
