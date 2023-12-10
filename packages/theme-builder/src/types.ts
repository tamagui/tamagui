// only used by the studio theme builder generated:

import { MaskOptions, Template } from '@tamagui/create-theme'

export type BuildThemeSuiteProps = {
  baseTheme: BuildTheme
  subThemes?: (BuildTheme | BuildThemeMask)[]
  componentMask?: MaskOptions
  templates?: {
    base: Template
    accentLight: Template
    accentDark: Template
  }
}

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

type BuildThemeFromScale = BuildThemeBase & {
  type: 'theme'

  hue: number // 0-360
  hueColor?: number // 0-360 (if distinguished from background)

  // if you use a preset it sets this then clears when changed
  createdFrom?: ScaleTypeName

  satScale: {
    light: number[]
    dark: number[]
  }

  lumScale: {
    light: number[]
    dark: number[]
  }

  // overrides the above hue/scales, avoiding too much mess refactoring
  strategy?: {
    type: 'automatic'
    foreground: string
    background: string
  }

  template?: Template
}

export type BuildTheme = BuildThemeFromScale & {
  accent?: BuildThemeFromScale
}

// TODO type here isnt the same as type in BuildTheme
export type BuildMask = { id: string } & (
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
}
