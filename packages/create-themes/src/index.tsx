import { Variable } from '@tamagui/core'

export * from './createThemes'

type ThemeMask = Record<string, number | string>
type Palette = string[]
type GenericTheme = { [key: string]: string | Variable }

const themeInfo = new WeakMap<any, { palette: Palette; definition: ThemeMask }>()

export function createThemeFromPalette<Definition extends ThemeMask>(
  palette: Palette,
  definition: Definition
): {
  [key in keyof Definition]: string
} {
  const theme = Object.fromEntries(
    Object.entries(definition).map(([key, offset]) => [
      key,
      typeof offset === 'number' ? palette[offset] : offset,
    ])
  ) as any

  themeInfo.set(theme, { palette, definition })

  return theme
}

export function extendTheme<Theme extends GenericTheme>(
  theme: Theme,
  mask: ThemeMask
): Theme {
  const info = themeInfo.get(theme)
  if (!info) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme`
        : `❌ Err2`
    )
  }
  return createThemeFromPalette(info.palette, addMask(info.definition, mask)) as Theme
}

const addMask = (a: ThemeMask, b: ThemeMask): ThemeMask => {
  return Object.fromEntries(
    Object.entries(a).map(([key, val]) => {
      return [key, addMaskValue(val, b[key])]
    })
  )
}

const addMaskValue = (
  a: string | number,
  b: string | number | undefined
): number | string => {
  if (b === undefined) return a
  if (typeof b === 'string') return b
  if (typeof a === 'string')
    throw new Error(
      process.env.NODE_ENV !== 'production' ? `Can't mask number over string` : `❌ Err3`
    )
  return a + b
}
