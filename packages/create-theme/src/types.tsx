import type { Variable } from '@tamagui/web'

export type CreateThemePalette = (string | Variable)[]

export type ThemeMask = Record<string, string | number>

export type MaskOptions = {
  palette?: CreateThemePalette
  override?: Partial<ThemeMask>
  skip?: Partial<ThemeMask>
  strength?: number
  max?: number
  min?: number
}

export type GenericTheme = { [key: string]: string | Variable }

export type CreateMask = {
  name: string
  mask: <A extends ThemeMask>(template: A, options: MaskOptions) => A
}
