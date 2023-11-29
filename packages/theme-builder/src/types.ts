// only used by the studio theme builder generated:

import { Template } from '@tamagui/create-theme'

export type BuildThemeSuiteProps = {
  baseTheme: BuildTheme
  subThemes?: (BuildTheme | BuildThemeMask)[]
}

export type ScaleTypeName =
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

export type BuildTheme = BuildThemeBase & {
  type: 'theme'
  color: string
  scale: ScaleTypeName
  template?: Template
  accent?: string
  accentColor?: string
  accentScale?: ScaleTypeName
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
