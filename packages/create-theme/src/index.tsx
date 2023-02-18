import type { Variable } from '@tamagui/web'

export type ThemeMask = Record<string, string | number>
export type Palette = string[]

export type MaskOptions = {
  palette?: Palette
  skip?: Partial<ThemeMask>
  strength?: number
  max?: number
  min?: number
}

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

export const createShiftMask = ({ inverse }: { inverse?: boolean } = {}) => {
  return ((template, { skip, max: maxIn, palette, min = 0, strength = 1 }) => {
    const values = Object.entries(template)
    const max = maxIn ?? (palette ? Object.values(palette).length - 1 : Infinity)
    const out = {}
    for (const [key, value] of values) {
      if (typeof value === 'string') continue
      if (skip && key in skip) {
        out[key] = value
        continue
      }
      const isPositive = value === 0 ? !isMinusZero(value) : value >= 0
      const direction = isPositive ? 1 : -1
      const invert = inverse ? -1 : 1
      const next = value + strength * direction * invert
      const clamped = isPositive
        ? Math.max(min, Math.min(max, next))
        : Math.min(-min, Math.max(-max, next))

      out[key] = clamped
    }
    return out as typeof template
  }) as CreateMask
}

export const createWeakenMask = () => createShiftMask()
export const createStrengthenMask = () => createShiftMask({ inverse: true })

function isMinusZero(value) {
  return 1 / value === -Infinity
}

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

  const template = mask(info.definition, {
    ...options,
    palette: info.palette,
  })
  const next = createTheme(info.palette, template) as Theme

  info.cache.set(mask, next)

  return next
}

// dev time tests!
if (process.env.NODE_ENV === 'development') {
  const palette = ['0', '1', '2', '3', '-3', '-2', '-1', '-0']
  const template = { bg: 1, fg: -1 }

  const stongerMask = createStrengthenMask()
  const weakerMask = createWeakenMask()

  const theme = createTheme(palette, template)
  if (theme.bg !== '1') throw new Error(`invalid`)
  if (theme.fg !== '-1') throw new Error(`invalid`)

  const str = applyMask(theme, stongerMask)
  if (str.bg !== '0') throw new Error(`invalid`)
  if (str.fg !== '-0') throw new Error(`invalid`)

  const weak = applyMask(theme, weakerMask)

  if (weak.bg !== '2') throw new Error(`invalid`)
  if (weak.fg !== '-2') throw new Error(`invalid`)
}
