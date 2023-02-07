import type { Variable } from '@tamagui/web'

type GenericTheme = { [key: string]: string | Variable }

export type ThemeMask = Record<string, string | number>
export type Palette = string[]

type CreateMask = <A extends ThemeMask>(template: A) => A

const THEME_INFO = new WeakMap<
  any,
  { palette: Palette; definition: ThemeMask; cache: WeakMap<any, any> }
>()

export function createTheme<
  Definition extends ThemeMask,
  Extras extends Record<string, string> = {}
>(
  palette: Palette,
  definition: Definition,
  options?: {
    nonInheritedValues?: Extras
  }
): {
  [key in keyof Definition | keyof Extras]: string
} {
  const theme = {
    ...(Object.fromEntries(
      Object.entries(definition).map(([key, offset]) => {
        return [key, getValue(palette, offset)]
      })
    ) as any),
    ...options?.nonInheritedValues,
  }
  THEME_INFO.set(theme, { palette, definition, cache: new WeakMap() })
  return theme
}

const getValue = (palette: Palette, maskValue: string | number) => {
  if (typeof maskValue === 'string') return maskValue
  const max = palette.length
  const index = Math.min(
    Math.max(0, maskValue < 0 ? max + maskValue : maskValue),
    max - 1
  )
  return palette[index]
}

type SubThemeKeys<ParentKeys, ChildKeys> = `${ParentKeys extends string
  ? ParentKeys
  : never}_${ChildKeys extends string ? ChildKeys : never}`

export function addChildren<
  Theme extends GenericTheme,
  Themes extends { [key: string]: Theme },
  GetChildren extends (name: keyof Themes, theme: Theme) => { [key: string]: Theme }
>(
  themes: Themes,
  getChildren: GetChildren
): Themes & {
  [key in SubThemeKeys<keyof Themes, keyof ReturnType<GetChildren>>]: Theme
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

export type ShiftMaskProps = { by: number; max: number; min?: number }

export const weakenMask = ({
  by = 1,
  max,
  min = 0,
  inverse,
}: ShiftMaskProps & { inverse?: boolean }) => {
  return ((template) => {
    const values = Object.entries(template) // .filter(Number)
    const out = {}
    for (const [key, value] of values) {
      if (typeof value === 'string') continue
      const direction = value >= 0 ? 1 : -1
      const next = value + by * direction
      const clamped = next >= 0 ? Math.max(min, next) : Math.min(-min, next)
      out[key] = clamped
    }
    return out as typeof template
  }) as CreateMask
}

export const strengthenMask = (props: ShiftMaskProps) =>
  weakenMask({ ...props, inverse: true })

export function applyMask<Theme extends GenericTheme>(
  theme: Theme,
  mask: CreateMask
): Theme {
  const info = THEME_INFO.get(theme)
  if (!info) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme`
        : `❌ Err2`
    )
  }
  if (info.cache.has(mask)) {
    return info.cache.get(mask)
  }

  const template = mask(info.definition)
  const next = createTheme(info.palette, template) as Theme
  console.log('got', template, 'created', next)

  info.cache.set(mask, next)

  return next
}
