import { THEME_CLASSNAME_PREFIX } from '../constants/constants'

export function getThemeParentClassName(themeName?: string | null) {
  return `${themeName ? `${THEME_CLASSNAME_PREFIX}${themeName}` : ''}`
}
