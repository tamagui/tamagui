import type { StaticConfig, ThemeParsed } from 'tamagui';
import { Theme } from 'tamagui'

export type ConfigSubPane =
  | 'settings'
  | 'media'
  | 'fonts'
  | 'animations'
  | 'shorthands'
  | `fonts-${string}`
  | `tokens-color-picker`

export const TABS = [
  'view',
  'config',
  'colors',
  'themes',
  'fonts',
  'components',
  'screens',
  'tokens',
  'animations',
] as const
export type Tabs = typeof TABS
export type Tab = (typeof TABS)[number]

export type Components = {
  [key: string]: {
    staticConfig: StaticConfig
  }
}

export type Color = {
  hue: number // 0-360
  saturation: number // 0-100
  lightness: number // 0-100
  originalValue?: any
}

export type Curve = {
  id: string
  name: string
  type: 'hue' | 'saturation' | 'lightness'
  values: number[]
}

export type Scale = {
  name: string
  colors: Color[]
  // original theme values
  originalValues: string[]
  curves: Partial<Record<Curve['type'], string>>
}

export type Palette = {
  id: string
  name: string
  backgroundColor: string
  scales: Record<string, Scale>
  curves: Record<string, Curve>
}

type ThemeKey = string
type ColorId = string

export type ThemeCategory = string

export type ThemeWithCategory = {
  theme: ThemeParsed
  id: string
  category: ThemeCategory
  categoryID: string
  level: number
}

export type ThemeTemplate = {
  [key: string]: number
}

export type PseudoKeys = 'Hover' | 'Press' | 'Focus' | 'Base'
export type PseudoKeysLowercase = 'hover' | 'press' | 'focus' | 'base'

export type ThemeVal = {
  name: string
  pseudo: PseudoKeys
  offset: number | null
  value: any
  color?: Color
}

export type DialogTypes = {
  none: {}
  'create-workspace': {}
  'create-theme': CreateThemeDialogProps
  'create-animation': CreateAnimationDialogProps
  'confirm-delete': ConfirmDeleteDialogProps
  alert: StudioAlertDialogProps
  export: ExportDialogProps
}

export type StudioDialogProps = DialogTypes[keyof DialogTypes]

export type CreateThemeDialogProps = {
  category: ThemeCategory
}

export type StudioAlertDialogProps = {
  title?: string
  message?: string
}

export type ConfirmDeleteDialogProps = {
  thingName?: string
}

export type CreateAnimationDialogProps = {}

export type ExportDialogProps = {
  snippet: string
}
// ---- helpers ----

export type DeepMutable<T> = T extends (infer R)[]
  ? DeepMutableArray<R>
  : T extends (...args: infer Args) => infer Result
  ? (...args: Args) => UnwrapReadonly<Result>
  : T extends object
  ? DeepMutableObject<T>
  : T

export type DeepMutableArray<T> = T extends ReadonlyArray<infer X>
  ? DeepMutable<X>
  : DeepMutable<T>

export type DeepMutableObject<T> = {
  -readonly [Key in keyof T]: DeepMutable<T[Key]>
}

type UnwrapReadonly<T> = T extends DeepReadonlyArray<infer X>
  ? X
  : T extends DeepReadonlyObject<infer X>
  ? X
  : T

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepReadonlyObject<T>
  : T

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}
