import type {
  MaskOptions,
  Template,
  ThemeDefinitions,
  ThemeWithParent,
} from '@tamagui/create-theme'

export type ThemeBuilderState = {
  themeSuites: {
    [id: string]: ThemeSuiteItem
  }
}

export type ThemeSuiteItem = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  selectedSchemes: { light: boolean; dark: boolean }
  baseTheme: BuildTheme
  subThemes: BuildSubTheme[]
  palettes: Record<string, BuildPalette>
  componentThemes: ThemeDefinitions
  templates: BuildTemplates
}

export type BuildComponentTheme = {
  type: 'parent'
  items: ThemeWithParent[]
}

export type ThemeSuiteItemData = Omit<ThemeSuiteItem, 'id' | 'createdAt' | 'updatedAt'>

export type BuildTemplates = Record<string, Template> & {
  base: Template
  accentLight?: Template
  accentDark?: Template
}

export type BuildSubTheme = BuildTheme | BuildThemeMask

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

// TODO type here isnt the same as type in BuildTheme
export type BuildMask = { id: string } & (
  | {
      type: 'override'
      override: Record<string, number>
    }
  | {
      type: 'strengthen'
      strength: number
    }
  | {
      type: 'soften'
      strength: number
    }
  | {
      type: 'inverse'
    }
  | {
      type: 'strengthenBorder'
      strength: number
    }
  | {
      type: 'softenBorder'
      strength: number
    }
)

export type BuildThemeMask = BuildThemeBase & {
  type: 'mask'
  masks: BuildMask[]
  maskOptions?: MaskOptions
}

export type ThemeStepProps = {
  theme: BuildTheme
  isAccent?: boolean
  vertical?: boolean
  onUpdate: (val: Partial<BuildTheme>) => void
}
