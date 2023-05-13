import type { Variable } from '@tamagui/web'

export type ThemeMask = Record<string, string | number>
export type Palette = (string | Variable)[]

export type MaskOptions = {
  palette?: Palette
  override?: Partial<ThemeMask>
  skip?: Partial<ThemeMask>
  strength?: number
  max?: number
  min?: number
}

type GenericTheme = { [key: string]: string | Variable }

export type CreateMask = <A extends ThemeMask>(template: A, options: MaskOptions) => A

const THEME_INFO = new WeakMap<
  any,
  { palette: Palette; definition: ThemeMask; cache: Map<any, any> }
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
  THEME_INFO.set(theme, { palette, definition, cache: new Map() })
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

export const skipMask: CreateMask = (template, { skip }) => {
  if (!skip) return template
  return Object.fromEntries(
    Object.entries(template).filter(([k]) => !(k in skip))
  ) as typeof template
}

export const createShiftMask = ({ inverse }: { inverse?: boolean } = {}) => {
  return ((template, opts) => {
    const { override, max: maxIn, palette, min = 0, strength = 1 } = opts
    const values = Object.entries(template)
    const max = maxIn ?? (palette ? Object.values(palette).length - 1 : Infinity)
    const out = {}
    for (const [key, value] of values) {
      if (typeof value === 'string') continue
      if (typeof override?.[key] === 'number') {
        const overrideShift = override[key] as number
        out[key] = value + overrideShift
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

    return skipMask(out, opts) as typeof template
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

  const template = mask(info.definition, {
    palette: info.palette,
    ...options,
  })
  const next = createTheme(info.palette, template) as Theme

  return next
}

// --- tests ---

if (process.env.NODE_ENV === 'development') {
  const palette = ['0', '1', '2', '3', '-3', '-2', '-1', '-0']
  const template = { bg: 1, fg: -1 }

  const stongerMask = createStrengthenMask()
  const weakerMask = createWeakenMask()

  const theme = createTheme(palette, template)
  if (theme.bg !== '1') throw `❌`
  if (theme.fg !== '-1') throw `❌`

  const str = applyMask(theme, stongerMask)
  if (str.bg !== '0') throw `❌`
  if (str.fg !== '-0') throw `❌`

  const weak = applyMask(theme, weakerMask)
  if (weak.bg !== '2') throw `❌`
  if (weak.fg !== '-2') throw `❌`

  const weak2 = applyMask(theme, weakerMask, { strength: 2 })
  if (weak2.bg !== '3') throw `❌`
  if (weak2.fg !== '-3') throw `❌`
}
