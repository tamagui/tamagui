import type {
  CreateThemeOptions,
  CreateThemePalette,
  GenericTheme,
  ThemeMask,
} from './createThemeTypes'
import { isMinusZero } from './isMinusZero'
import { setThemeInfo } from './themeInfo'

const identityCache = new Map()

export function createThemeWithPalettes<
  Definition extends ThemeMask,
  Extras extends GenericTheme = {},
>(
  palettes: Record<string, CreateThemePalette>,
  defaultPalette: string,
  definition: Definition,
  options?: CreateThemeOptions,
  name?: string,
  skipCache = false
): {
  [key in keyof Definition | keyof Extras]: string
} {
  if (!palettes[defaultPalette]) {
    throw new Error(`No pallete: ${defaultPalette}`)
  }
  const newDef = { ...definition }
  for (const key in definition) {
    let val = definition[key]
    if (typeof val === 'string' && val[0] === '$') {
      const [altPaletteName$, altPaletteIndex] = val.split('.')
      const altPaletteName = altPaletteName$.slice(1)
      const parentName = defaultPalette.split('_')[0]
      const altPalette =
        palettes[altPaletteName] || palettes[`${parentName}_${altPaletteName}`]

      if (altPalette) {
        const next = getValue(altPalette, +altPaletteIndex)
        if (typeof next !== 'undefined') {
          newDef[key] = next as any
        }
      }
    }
  }

  return createTheme(palettes[defaultPalette], newDef, options, name, skipCache)
}

export function createTheme<
  Definition extends ThemeMask,
  Extras extends GenericTheme = {},
>(
  palette: CreateThemePalette,
  definition: Definition,
  options?: CreateThemeOptions,
  name?: string,
  skipCache = false
): {
  [key in keyof Definition | keyof Extras]: string
} {
  const cacheKey = skipCache ? '' : JSON.stringify([name, palette, definition, options])
  if (!skipCache) {
    if (identityCache.has(cacheKey)) {
      return identityCache.get(cacheKey)
    }
  }

  const theme = {
    ...(Object.fromEntries(
      Object.entries(definition).map(([key, offset]) => {
        return [key, getValue(palette, offset)]
      })
    ) as any),
    ...options?.nonInheritedValues,
  }

  setThemeInfo(theme, { palette, definition, options, name })

  if (cacheKey) {
    identityCache.set(cacheKey, theme)
  }

  return theme
}

const getValue = (palette: CreateThemePalette, value: string | number) => {
  if (!palette) {
    throw new Error(`No palette!`)
  }
  if (typeof value === 'string') {
    return value
  }
  const max = palette.length - 1
  const isPositive = value === 0 ? !isMinusZero(value) : value >= 0
  const next = isPositive ? value : max + value
  const index = Math.min(Math.max(0, next), max)
  return palette[index]
}

type SubThemeKeys<ParentKeys, ChildKeys> = `${ParentKeys extends string
  ? ParentKeys
  : never}_${ChildKeys extends string ? ChildKeys : never}`

type ChildGetter<Name extends string | number | symbol, Theme extends GenericTheme> = (
  name: Name,
  theme: Theme
) => { [key: string]: Theme }

export function addChildren<
  Themes extends { [key: string]: GenericTheme },
  GetChildren extends ChildGetter<keyof Themes, Themes[keyof Themes]>,
>(
  themes: Themes,
  getChildren: GetChildren
): Themes & {
  [key in SubThemeKeys<keyof Themes, keyof ReturnType<GetChildren>>]: Themes[keyof Themes]
} {
  const out = { ...themes }
  for (const key in themes) {
    const subThemes = getChildren(key, themes[key])
    for (const sKey in subThemes) {
      out[`${key}_${sKey}`] = subThemes[sKey] as any
    }
  }
  return out as any
}
