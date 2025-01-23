import type { Template } from '@tamagui/create-theme'

type ThemeSuiteItem = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  schemes: { light: boolean; dark: boolean }
  palettes: Record<string, BuildPalette>
}

export type ThemeSuiteItemData = Omit<ThemeSuiteItem, 'id' | 'createdAt' | 'updatedAt'>

export type BuildTemplates = Record<string, Template>

export type BuildSubTheme = BuildTheme

export type BuildPalettes = Record<string, BuildPalette>

export type BuildPalette = {
  name: string
  scale?: ScaleTypeName
  anchors: BuildThemeAnchor[]
}

export type BuildThemeSuiteProps = Omit<ThemeSuiteItemData, 'name'>

export type BuildThemeSuitePalettes = {
  light: string[]
  dark: string[]
  lightAccent?: string[]
  darkAccent?: string[]
}

export type ScaleTypeName =
  | 'custom'
  | 'radix'
  | 'radix-b'
  | 'radius-bold'
  | 'radius-bright'
  | 'linear'
  | 'pastel'
  | 'pastel-desaturating'
  | 'neon'
  | 'neon-bright'
  | 'neon-c'

export type BuildThemeBase = {
  id: string
  name: string
  errors?: string[]
}

export type BuildThemeAnchor = {
  index: number
  hue: {
    light: number
    dark: number
    sync?: boolean
    syncLeft?: boolean
  }
  sat: {
    light: number
    dark: number
    sync?: boolean
    syncLeft?: boolean
  }
  lum: {
    light: number
    dark: number
  }
}

export type BuildPaletteAnchors = BuildThemeAnchor[]

export type BuildTheme = BuildThemeBase & {
  type: 'theme'
  template: string
  palette: string
  accent?: BuildTheme
}

export type ThemeStepProps = {
  theme: BuildTheme
  isAccent?: boolean
  vertical?: boolean
  onUpdate: (val: Partial<BuildTheme>) => void
}
