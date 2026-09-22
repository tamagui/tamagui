import {
  type GetThemeContext,
  type ThemeDefinitionContext,
  type ThemeInputValue,
} from '@tamagui/create-theme'
import type { Theme, ThemeNames } from './generated'
import { colorTokens as baseColorTokens, tokens, type ColorTokenName } from './tokens'
export { createThemes } from '@tamagui/create-theme'
export type { GetThemeContext, ThemeDefinitionContext } from '@tamagui/create-theme'
export { colorTokens, tailwindColors, tokens } from './tokens'
export declare const shades: readonly [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950,
]
export declare const shadows: {
  readonly light: {
    readonly 'shadow-1': 'rgba(0, 0, 0, 0.04)'
    readonly 'shadow-2': 'rgba(0, 0, 0, 0.08)'
    readonly 'shadow-3': 'rgba(0, 0, 0, 0.12)'
    readonly 'shadow-4': 'rgba(0, 0, 0, 0.22)'
    readonly 'shadow-5': 'rgba(0, 0, 0, 0.33)'
    readonly 'shadow-6': 'rgba(0, 0, 0, 0.44)'
    readonly 'shadow-7': 'rgba(0, 0, 0, 0.6)'
  }
  readonly dark: {
    readonly 'shadow-1': 'rgba(0, 0, 0, 0.15)'
    readonly 'shadow-2': 'rgba(0, 0, 0, 0.23)'
    readonly 'shadow-3': 'rgba(0, 0, 0, 0.33)'
    readonly 'shadow-4': 'rgba(0, 0, 0, 0.45)'
    readonly 'shadow-5': 'rgba(0, 0, 0, 0.65)'
    readonly 'shadow-6': 'rgba(0, 0, 0, 0.8)'
    readonly 'shadow-7': 'rgba(0, 0, 0, 0.9)'
  }
}
export type ShadowName = keyof (typeof shadows)['light']
export type Shade = (typeof shades)[number]
type PaletteFromToken<Token> = Token extends `${infer Name}-${Shade}` ? Name : never
export type Palette = PaletteFromToken<ColorTokenName>
export type Scheme = 'light' | 'dark'
export type Level = 1 | 2 | 3 | 4
export declare const semanticThemeKeys: readonly [
  'background',
  'background-hover',
  'background-press',
  'background-focus',
  'background-active',
  'border-color',
  'border-color-hover',
  'border-color-press',
  'border-color-focus',
  'color',
  'color-hover',
  'color-press',
  'color-focus',
  'placeholder-color',
  'outline-color',
  'shadow-color',
  'accent-background',
  'accent-color',
]
export type SemanticThemeKey = (typeof semanticThemeKeys)[number]
export type ThemeScale<TokenName extends string = ColorTokenName> = Record<
  Exclude<SemanticThemeKey, 'shadow-color'>,
  Shade | TokenName
> & {
  'shadow-color': ShadowName
}
export declare function raise<TokenName extends string>(
  scale: ThemeScale<TokenName>,
  steps: number
): ThemeScale<TokenName>
export declare function activeScale<TokenName extends string>(
  scale: ThemeScale<TokenName>
): ThemeScale<TokenName>
export declare const scales: {
  readonly normal: {
    readonly light: {
      readonly 1: {
        readonly background: 50
        readonly 'background-hover': 'white'
        readonly 'background-press': 100
        readonly 'background-focus': 'white'
        readonly 'background-active': 'white'
        readonly 'border-color': 200
        readonly 'border-color-hover': 300
        readonly 'border-color-press': 200
        readonly 'border-color-focus': 300
        readonly color: 950
        readonly 'color-hover': 950
        readonly 'color-press': 950
        readonly 'color-focus': 950
        readonly 'placeholder-color': 500
        readonly 'outline-color': 400
        readonly 'shadow-color': 'shadow-3'
        readonly 'accent-background': 'brand-600'
        readonly 'accent-color': 'brand-50'
      }
      readonly 2: ThemeScale<'brand-50' | 'brand-600' | 'white'>
      readonly 3: ThemeScale<'brand-50' | 'brand-600' | 'white'>
      readonly 4: ThemeScale<'brand-50' | 'brand-600' | 'white'>
    }
    readonly dark: {
      readonly 1: {
        readonly 'placeholder-color': 500
        readonly 'outline-color': 400
        readonly 'accent-background': 'brand-600'
        readonly 'accent-color': 'brand-50'
        readonly background: 950
        readonly 'background-hover': 900
        readonly 'background-press': 'black'
        readonly 'background-focus': 900
        readonly 'background-active': 900
        readonly 'border-color': 800
        readonly 'border-color-hover': 700
        readonly 'border-color-press': 800
        readonly 'border-color-focus': 700
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'shadow-color': 'shadow-3'
      }
      readonly 2: ThemeScale<'black' | 'brand-50' | 'brand-600'>
      readonly 3: ThemeScale<'black' | 'brand-50' | 'brand-600'>
      readonly 4: ThemeScale<'black' | 'brand-50' | 'brand-600'>
    }
  }
  readonly bold: {
    readonly light: {
      readonly 1: {
        readonly background: 600
        readonly 'background-hover': 500
        readonly 'background-press': 700
        readonly 'background-focus': 500
        readonly 'background-active': 500
        readonly 'border-color': 700
        readonly 'border-color-hover': 600
        readonly 'border-color-press': 700
        readonly 'border-color-focus': 600
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'shadow-color': 'shadow-3'
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
      }
      readonly 2: {
        readonly background: 600
        readonly 'background-hover': 500
        readonly 'background-press': 700
        readonly 'background-focus': 500
        readonly 'background-active': 500
        readonly 'border-color': 700
        readonly 'border-color-hover': 600
        readonly 'border-color-press': 700
        readonly 'border-color-focus': 600
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'shadow-color': 'shadow-3'
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
      }
      readonly 3: {
        readonly background: 600
        readonly 'background-hover': 500
        readonly 'background-press': 700
        readonly 'background-focus': 500
        readonly 'background-active': 500
        readonly 'border-color': 700
        readonly 'border-color-hover': 600
        readonly 'border-color-press': 700
        readonly 'border-color-focus': 600
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'shadow-color': 'shadow-3'
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
      }
      readonly 4: {
        readonly background: 600
        readonly 'background-hover': 500
        readonly 'background-press': 700
        readonly 'background-focus': 500
        readonly 'background-active': 500
        readonly 'border-color': 700
        readonly 'border-color-hover': 600
        readonly 'border-color-press': 700
        readonly 'border-color-focus': 600
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'shadow-color': 'shadow-3'
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
      }
    }
    readonly dark: {
      readonly 1: {
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
        readonly background: 500
        readonly 'background-hover': 400
        readonly 'background-press': 600
        readonly 'background-focus': 400
        readonly 'background-active': 400
        readonly 'border-color': 600
        readonly 'border-color-hover': 500
        readonly 'border-color-press': 600
        readonly 'border-color-focus': 500
        readonly 'shadow-color': 'shadow-3'
      }
      readonly 2: {
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
        readonly background: 500
        readonly 'background-hover': 400
        readonly 'background-press': 600
        readonly 'background-focus': 400
        readonly 'background-active': 400
        readonly 'border-color': 600
        readonly 'border-color-hover': 500
        readonly 'border-color-press': 600
        readonly 'border-color-focus': 500
        readonly 'shadow-color': 'shadow-3'
      }
      readonly 3: {
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
        readonly background: 500
        readonly 'background-hover': 400
        readonly 'background-press': 600
        readonly 'background-focus': 400
        readonly 'background-active': 400
        readonly 'border-color': 600
        readonly 'border-color-hover': 500
        readonly 'border-color-press': 600
        readonly 'border-color-focus': 500
        readonly 'shadow-color': 'shadow-3'
      }
      readonly 4: {
        readonly color: 50
        readonly 'color-hover': 50
        readonly 'color-press': 50
        readonly 'color-focus': 50
        readonly 'placeholder-color': 200
        readonly 'outline-color': 400
        readonly 'accent-background': 'brand-50'
        readonly 'accent-color': 'brand-700'
        readonly background: 500
        readonly 'background-hover': 400
        readonly 'background-press': 600
        readonly 'background-focus': 400
        readonly 'background-active': 400
        readonly 'border-color': 600
        readonly 'border-color-hover': 500
        readonly 'border-color-press': 600
        readonly 'border-color-focus': 500
        readonly 'shadow-color': 'shadow-3'
      }
    }
  }
  readonly tint: {
    readonly light: {
      readonly 1: {
        readonly background: 100
        readonly 'background-hover': 50
        readonly 'background-press': 200
        readonly 'background-focus': 50
        readonly 'background-active': 50
        readonly 'border-color': 300
        readonly 'border-color-hover': 400
        readonly 'border-color-press': 300
        readonly 'border-color-focus': 400
        readonly color: 700
        readonly 'color-hover': 700
        readonly 'color-press': 700
        readonly 'color-focus': 700
        readonly 'placeholder-color': 400
        readonly 'outline-color': 400
        readonly 'shadow-color': 'shadow-3'
        readonly 'accent-background': 'brand-600'
        readonly 'accent-color': 'brand-50'
      }
      readonly 2: ThemeScale<'brand-50' | 'brand-600'>
      readonly 3: ThemeScale<'brand-50' | 'brand-600'>
      readonly 4: ThemeScale<'brand-50' | 'brand-600'>
    }
    readonly dark: {
      readonly 1: {
        readonly 'accent-background': 'brand-600'
        readonly 'accent-color': 'brand-50'
        readonly background: 900
        readonly 'background-hover': 800
        readonly 'background-press': 950
        readonly 'background-focus': 800
        readonly 'background-active': 800
        readonly 'border-color': 700
        readonly 'border-color-hover': 600
        readonly 'border-color-press': 700
        readonly 'border-color-focus': 600
        readonly color: 200
        readonly 'color-hover': 200
        readonly 'color-press': 200
        readonly 'color-focus': 200
        readonly 'placeholder-color': 500
        readonly 'outline-color': 600
        readonly 'shadow-color': 'shadow-3'
      }
      readonly 2: ThemeScale<'brand-50' | 'brand-600'>
      readonly 3: ThemeScale<'brand-50' | 'brand-600'>
      readonly 4: ThemeScale<'brand-50' | 'brand-600'>
    }
  }
}
export type Treatment = keyof typeof scales
export type DefaultRecipe = {
  scheme: Scheme
  palette: Palette
  treatment?: Treatment
  level?: Level
  active?: boolean
}
export type Ramp<PaletteName extends string = Palette> = Record<
  `color-${Level | 5 | 6 | 7 | 8 | 9 | 10 | 11}`,
  `${PaletteName}-${Shade}`
>
export declare function rampReversed(scheme: Scheme, scale?: ThemeScale<string>): boolean
export declare function ramp<const PaletteName extends string>(
  palette: PaletteName,
  scheme: Scheme,
  scale?: ThemeScale<string>
): Ramp<PaletteName>
export declare function fromShades<
  const PaletteName extends string,
  TokenName extends string,
>(
  palette: PaletteName,
  scale: ThemeScale<TokenName>
): Record<SemanticThemeKey, `${PaletteName}-${Shade}` | TokenName>
export type PaletteRecipe = {
  scheme: Scheme
  palette: string
  treatment?: Treatment
  level?: Level
  active?: boolean
}
export type PaletteTheme = Record<keyof Ramp | SemanticThemeKey | ShadowName, string>
export declare function getTheme(
  context:
    | GetThemeContext<typeof tokens, DefaultRecipe>
    | GetThemeContext<{ color: Record<string, string> }, PaletteRecipe>
): Record<keyof Ramp | SemanticThemeKey | ShadowName, ThemeInputValue<typeof tokens>>
/** eleven colors, from the 50 shade (palest) to 950 (deepest) */
export type PaletteRamp = readonly string[]
export type PaletteTokens<Palettes extends Record<string, PaletteRamp>> = {
  [Name in keyof Palettes & string as `${Name}-${Shade}`]: string
}
/** color tokens for palettes: `{ brand: [...] }` becomes `brand-50` through `brand-950` */
export declare function paletteTokens<const Palettes extends Record<string, PaletteRamp>>(
  palettes: Palettes
): PaletteTokens<Palettes>
export type PaletteThemesInput = {
  surface?: PaletteRamp
  brand?: PaletteRamp
} & Record<string, PaletteRamp>
/**
 * the whole theme system from your own palettes. `surface` grounds light and
 * dark (mauve when absent), `brand` fills the accent tint, the emphasis
 * `brand` theme and `accent-background` (blue when absent), and any other name
 * becomes a ramp addressable as `name-50` through `name-950`. dark reads each
 * ramp in reverse, so one ramp per palette covers both schemes, and every
 * role (background, hover, press, border, type, placeholder, accent) derives.
 */
export declare function createPaletteThemes<const Palettes extends PaletteThemesInput>(
  palettes: Palettes
): {
  colorTokens: typeof baseColorTokens & PaletteTokens<Palettes>
  themes: Record<ThemeNames, Theme>
}
type LevelParent = Record<string, unknown> & {
  level?: Level
}
type LevelDefinition<Depth extends number> = (
  context: ThemeDefinitionContext<LevelParent>
) => {
  level: Level
  children: LevelChildren<Depth>
} | null
export type LevelChildren<Depth extends number = 4> = Depth extends 4
  ? {
      level2: LevelDefinition<3>
      level3: LevelDefinition<3>
      level4: LevelDefinition<3>
    }
  : Depth extends 3
    ? {
        level2: LevelDefinition<2>
        level3: LevelDefinition<2>
        level4: LevelDefinition<2>
      }
    : Depth extends 2
      ? {
          level2: LevelDefinition<1>
          level3: LevelDefinition<1>
          level4: LevelDefinition<1>
        }
      : Depth extends 1
        ? {
            level2: LevelDefinition<0>
            level3: LevelDefinition<0>
            level4: LevelDefinition<0>
          }
        : {}
export declare function levels(max?: Level): LevelChildren
export declare const tree: {
  readonly light: {
    readonly scheme: 'light'
    readonly palette: 'mauve'
  }
  readonly dark: {
    readonly scheme: 'dark'
    readonly palette: 'mauve'
  }
  readonly children: {
    readonly level2: LevelDefinition<3>
    readonly level3: LevelDefinition<3>
    readonly level4: LevelDefinition<3>
    readonly accent: {
      readonly palette: 'brand'
      readonly treatment: 'tint'
      readonly children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly brand: ({ parent }: ThemeDefinitionContext) => {
      scheme: string
      children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly inverse: ({ parent }: ThemeDefinitionContext) => {
      scheme: string
      children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly active: {
      readonly active: true
      readonly children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly black: {
      readonly scheme: 'dark'
      readonly children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly white: {
      readonly scheme: 'light'
      readonly children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly red: {
      readonly palette: 'red'
      readonly treatment: 'tint'
      readonly children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly yellow: {
      readonly palette: 'yellow'
      readonly treatment: 'tint'
      readonly children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
    readonly green: {
      readonly palette: 'green'
      readonly treatment: 'tint'
      readonly children: {
        level2: LevelDefinition<3>
        level3: LevelDefinition<3>
        level4: LevelDefinition<3>
      }
    }
  }
}
export declare const themes: import('@tamagui/create-theme').CreatedThemes<
  import('@tamagui/create-theme').ThemeNames<{
    readonly light: {
      readonly scheme: 'light'
      readonly palette: 'mauve'
    }
    readonly dark: {
      readonly scheme: 'dark'
      readonly palette: 'mauve'
    }
    readonly children: {
      readonly level2: LevelDefinition<3>
      readonly level3: LevelDefinition<3>
      readonly level4: LevelDefinition<3>
      readonly accent: {
        readonly palette: 'brand'
        readonly treatment: 'tint'
        readonly children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly brand: ({ parent }: ThemeDefinitionContext) => {
        scheme: string
        children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly inverse: ({ parent }: ThemeDefinitionContext) => {
        scheme: string
        children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly active: {
        readonly active: true
        readonly children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly black: {
        readonly scheme: 'dark'
        readonly children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly white: {
        readonly scheme: 'light'
        readonly children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly red: {
        readonly palette: 'red'
        readonly treatment: 'tint'
        readonly children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly yellow: {
        readonly palette: 'yellow'
        readonly treatment: 'tint'
        readonly children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
      readonly green: {
        readonly palette: 'green'
        readonly treatment: 'tint'
        readonly children: {
          level2: LevelDefinition<3>
          level3: LevelDefinition<3>
          level4: LevelDefinition<3>
        }
      }
    }
  }>,
  PaletteTheme
>
//# sourceMappingURL=builder.d.ts.map
