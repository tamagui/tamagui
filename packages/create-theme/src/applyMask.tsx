import { createTheme } from './createTheme'
import type { CreateMask, GenericTheme, MaskOptions, ThemeMask } from './createThemeTypes'
import type { ThemeInfo } from './themeInfo'
import { getThemeInfo, setThemeInfo } from './themeInfo'

export function applyMask<Theme extends GenericTheme | ThemeMask>(
  theme: Theme,
  mask: CreateMask,
  options: MaskOptions = {},
  parentName?: string,
  nextName?: string
): Theme {
  const info = getThemeInfo(theme, parentName)
  if (!info) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme`
        : `❌ Err2`
    )
  }

  const next = applyMaskStateless(info, mask, options, parentName)

  setThemeInfo(next.theme, {
    definition: next.definition,
    palette: info.palette,
    name: nextName,
  })

  return next.theme as Theme
}

export function applyMaskStateless<Theme extends GenericTheme | ThemeMask>(
  info: ThemeInfo,
  mask: CreateMask,
  options: MaskOptions = {},
  parentName?: string
): ThemeInfo & {
  theme: Theme
} {
  const skip = {
    ...options.skip,
  }

  // skip nonInheritedValues from parent theme
  if (info.options?.nonInheritedValues) {
    for (const key in info.options.nonInheritedValues) {
      skip[key] = 1
    }
  }

  // convert theme back to template first
  const maskOptions = {
    parentName,
    palette: info.palette,
    ...options,
    skip,
  }

  const template = mask.mask(info.definition, maskOptions)
  const theme = createTheme(info.palette, template) as Theme

  return {
    ...info,
    cache: new Map(),
    definition: template,
    theme,
  }
}
