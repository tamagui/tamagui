import type { Variable } from '@tamagui/web'

export type ThemeMask = Record<string, string | number>
export type Palette = string[]
export type ShiftMaskProps = { by: number; max: number; min?: number }
export type MaskOptions = { skip?: Partial<ThemeMask> }

type GenericTheme = { [key: string]: string | Variable }
type CreateMask = <A extends ThemeMask>(template: A, options: MaskOptions) => A

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

const getValue = (palette: Palette, value: string | number) => {
  if (typeof value === 'string') return value
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
  GetChildren extends ChildGetter<keyof Themes, Themes[keyof Themes]>
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

// const x = createTheme([], { bg: 1 })
// const y = addChildren({ x }, (_, x2) => ({
//   y: x,
// }))

export const createWeakenMask = ({
  by = 1,
  max,
  min = 0,
  inverseNegatives,
}: ShiftMaskProps & { inverseNegatives?: boolean }) => {
  return ((template, { skip }) => {
    const values = Object.entries(template) // .filter(Number)
    const out = {}
    for (const [key, value] of values) {
      if (typeof value === 'string') continue
      if (skip && key in skip) {
        out[key] = value
        continue
      }
      const isPositive = value === 0 ? !isMinusZero(value) : value >= 0
      const direction = isPositive ? 1 : -1
      const invert = inverseNegatives && !isPositive ? -1 : 1
      const next = value + by * direction * invert
      const clamped = isPositive
        ? Math.max(min, Math.min(max, next))
        : Math.min(-min, Math.max(-max, next))

      out[key] = clamped
    }
    return out as typeof template
  }) as CreateMask
}

function isMinusZero(value) {
  return 1 / value === -Infinity
}

export const createStrengthenMask = (props: ShiftMaskProps) =>
  createWeakenMask({ ...props, inverseNegatives: true })

export function applyMask<Theme extends GenericTheme>(
  theme: Theme,
  mask: CreateMask,
  options: MaskOptions = {}
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

  const template = mask(info.definition, options)
  const next = createTheme(info.palette, template) as Theme

  info.cache.set(mask, next)

  return next
}
