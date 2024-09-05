import type {
  CreateThemeOptions,
  CreateThemePalette,
  GenericTheme,
  ThemeMask,
} from './createThemeTypes'

export type ThemeInfo = {
  palette: CreateThemePalette
  definition: ThemeMask
  options?: CreateThemeOptions
  cache: Map<any, any>
}

const THEME_INFO = new Map<string, ThemeInfo>()

export const getThemeInfo = (
  theme: GenericTheme | ThemeMask,
  name?: string
): ThemeInfo | undefined => {
  return THEME_INFO.get(name || JSON.stringify(theme))
}

export const setThemeInfo = (
  theme: GenericTheme | ThemeMask,
  info: Pick<ThemeInfo, 'palette' | 'definition' | 'options'> & {
    name?: string
  }
) => {
  const next = {
    ...info,
    cache: new Map(),
  }
  THEME_INFO.set(info.name || JSON.stringify(theme), next)
  THEME_INFO.set(JSON.stringify(info.definition), next)
}
