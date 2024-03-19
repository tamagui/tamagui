import type { Variable } from '@tamagui/web'

export type CreateThemePalette = (string | Variable)[]

export type ThemeMask = Record<string, string | number>

export type MaskOptions = {
  palette?: CreateThemePalette
  override?: Partial<ThemeMask>
  overrideStrategy?: 'shift' | 'swap'
  overrideSwap?: Partial<ThemeMask>
  overrideShift?: Partial<ThemeMask>
  skip?: Partial<ThemeMask>
  strength?: number
  max?: number
  min?: number
  parentName?: string
}

export type GenericTheme = { [key: string]: string | Variable }

export type MaskFunction = <A extends ThemeMask>(template: A, options: MaskOptions) => A

export type CreateMask = {
  name: string
  mask: MaskFunction
}

export type CreateThemeOptions = {
  nonInheritedValues?: GenericTheme
}

export type Palette = string[]

export type Template = {
  [key: string]: number | string
}

export type ThemeUsingMask<Masks = string> = MaskOptions & {
  mask: Masks
  avoidNestingWithin?: string[]
  childOptions?: MaskOptions & {
    mask?: Masks
  }
}

export type ThemeUsingTemplate = CreateThemeOptions & {
  palette?: string
  template: string
}

type ThemePreDefined = {
  theme: { [key: string]: string }
}

export type Theme<Masks = string> =
  | ThemePreDefined
  | ThemeUsingTemplate
  | ThemeUsingMask<Masks>

export type ThemeWithParent<Masks = string> = Theme<Masks> & {
  parent: string
}

export type PaletteDefinitions = {
  [key: string]: Palette
}

export type ThemeDefinition<Masks extends string = string> =
  | Theme<Masks>
  | ThemeWithParent<Masks>[]

type UnionableString = string & {}

export type ThemeDefinitions<Masks extends string = string> = {
  [key: string]: ThemeDefinition<Masks | UnionableString>
}

export type TemplateDefinitions = {
  [key: string]: Template
}

export type MaskDefinitions = {
  [key: string]: CreateMask | CreateMask['mask']
}
