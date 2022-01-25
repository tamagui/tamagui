import { PREFIX } from '../constants/constants'

export function getThemeParentClassName(themeName?: string | null) {
  return `theme-parent ${themeName ? `${PREFIX}${themeName}` : ''}`
}
