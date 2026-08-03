import {
  createThemes,
  type GetThemeContext,
  type ThemeChildren,
  type ThemeDefinitionContext,
  type ThemeDefinitionObject,
} from '@tamagui/create-theme'

import { tokens, type ColorTokenName } from './tokens'

export { createThemes } from '@tamagui/create-theme'
export { colorTokens, tailwindColors, tokens } from './tokens'

export const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type Shade = (typeof shades)[number]

type PaletteFromToken<Token> = Token extends `${infer Name}-${Shade}` ? Name : never
export type Palette = PaletteFromToken<ColorTokenName>

export type Scheme = 'light' | 'dark'
export type Level = 1 | 2 | 3 | 4

export const semanticThemeKeys = [
  'background',
  'background-hover',
  'background-press',
  'background-focus',
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
] as const

export type SemanticThemeKey = (typeof semanticThemeKeys)[number]
export type ThemeScale = Record<SemanticThemeKey, Shade | ColorTokenName>

const light = {
  background: 'white',
  'background-hover': 50,
  'background-press': 'white',
  'background-focus': 50,
  'border-color': 200,
  'border-color-hover': 300,
  'border-color-press': 200,
  'border-color-focus': 300,
  color: 950,
  'color-hover': 950,
  'color-press': 950,
  'color-focus': 950,
  'placeholder-color': 500,
  'outline-color': 400,
  'shadow-color': 'shadow-3',
  'accent-background': 'brand-600',
  'accent-color': 'brand-50',
} as const satisfies ThemeScale

const dark = {
  ...light,
  background: 950,
  'background-hover': 900,
  'background-press': 950,
  'background-focus': 900,
  'border-color': 800,
  'border-color-hover': 700,
  'border-color-press': 800,
  'border-color-focus': 700,
  color: 50,
  'color-hover': 50,
  'color-press': 50,
  'color-focus': 50,
  'shadow-color': 'shadow-6',
} as const satisfies ThemeScale

const boldLight = {
  background: 600,
  'background-hover': 500,
  'background-press': 600,
  'background-focus': 500,
  'border-color': 700,
  'border-color-hover': 600,
  'border-color-press': 700,
  'border-color-focus': 600,
  color: 50,
  'color-hover': 50,
  'color-press': 50,
  'color-focus': 50,
  'placeholder-color': 200,
  'outline-color': 400,
  'shadow-color': 'shadow-3',
  'accent-background': 'brand-50',
  'accent-color': 'brand-700',
} as const satisfies ThemeScale

const boldDark = {
  ...boldLight,
  background: 500,
  'background-hover': 400,
  'background-press': 500,
  'background-focus': 400,
  'border-color': 600,
  'border-color-hover': 500,
  'border-color-press': 600,
  'border-color-focus': 500,
  'shadow-color': 'shadow-6',
} as const satisfies ThemeScale

const tintLight = {
  background: 100,
  'background-hover': 50,
  'background-press': 100,
  'background-focus': 50,
  'border-color': 300,
  'border-color-hover': 400,
  'border-color-press': 300,
  'border-color-focus': 400,
  color: 700,
  'color-hover': 700,
  'color-press': 700,
  'color-focus': 700,
  'placeholder-color': 400,
  'outline-color': 400,
  'shadow-color': 'shadow-3',
  'accent-background': 'brand-600',
  'accent-color': 'brand-50',
} as const satisfies ThemeScale

const tintDark = {
  ...tintLight,
  background: 900,
  'background-hover': 800,
  'background-press': 900,
  'background-focus': 800,
  'border-color': 700,
  'border-color-hover': 600,
  'border-color-press': 700,
  'border-color-focus': 600,
  color: 200,
  'color-hover': 200,
  'color-press': 200,
  'color-focus': 200,
  'placeholder-color': 500,
  'outline-color': 600,
  'shadow-color': 'shadow-6',
} as const satisfies ThemeScale

const ladder = ['white', ...shades, 'black'] as const

export function raise(scale: ThemeScale, steps: number): ThemeScale {
  return Object.fromEntries(
    Object.entries(scale).map(([key, value]) => {
      if (!key.startsWith('background') && !key.startsWith('border-color')) {
        return [key, value]
      }
      const index = ladder.indexOf(value as (typeof ladder)[number])
      if (index === -1) return [key, value]
      return [key, ladder[Math.max(0, Math.min(ladder.length - 1, index + steps))]]
    })
  ) as ThemeScale
}

export const scales = {
  normal: {
    light: {
      1: light,
      2: raise(light, 1),
      3: raise(light, 2),
      4: raise(light, 3),
    },
    dark: {
      1: dark,
      2: raise(dark, -1),
      3: raise(dark, -2),
      4: raise(dark, -3),
    },
  },
  bold: {
    light: {
      1: boldLight,
      2: raise(boldLight, -1),
      3: raise(boldLight, -2),
      4: raise(boldLight, -3),
    },
    dark: {
      1: boldDark,
      2: raise(boldDark, 1),
      3: raise(boldDark, 2),
      4: raise(boldDark, 3),
    },
  },
  tint: {
    light: {
      1: tintLight,
      2: raise(tintLight, -1),
      3: raise(tintLight, 1),
      4: raise(tintLight, 2),
    },
    dark: {
      1: tintDark,
      2: raise(tintDark, 1),
      3: raise(tintDark, -1),
      4: raise(tintDark, -2),
    },
  },
} as const

export type Treatment = keyof typeof scales

export type DefaultRecipe = {
  scheme: Scheme
  palette: Palette
  treatment?: Treatment
  level?: Level
}

export type Ramp = Record<`color${Level | 5 | 6 | 7 | 8 | 9 | 10 | 11}`, ColorTokenName>

export function ramp(palette: Palette, scheme: Scheme): Ramp {
  const ordered = scheme === 'light' ? shades : [...shades].reverse()
  return Object.fromEntries(
    ordered.map((shade, index) => [`color${index + 1}`, `${palette}-${shade}`])
  ) as Ramp
}

export function fromShades(
  palette: Palette,
  scale: ThemeScale
): Record<SemanticThemeKey, ColorTokenName> {
  return Object.fromEntries(
    Object.entries(scale).map(([key, value]) => [
      key,
      typeof value === 'number' ? `${palette}-${value}` : value,
    ])
  ) as Record<SemanticThemeKey, ColorTokenName>
}

export function getTheme({ recipe }: GetThemeContext<typeof tokens, DefaultRecipe>) {
  const scale = scales[recipe.treatment ?? 'normal'][recipe.scheme][recipe.level ?? 1]
  return {
    ...ramp(recipe.palette, recipe.scheme),
    ...fromShades(recipe.palette, scale),
  }
}

type LevelParent = Record<string, unknown> & { level?: Level }
type LevelDefinition<Depth extends number> = (
  context: ThemeDefinitionContext<LevelParent>
) => { level: Level; children: LevelChildren<Depth> } | null

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

function createLevels(max: Level, depth: 4): LevelChildren<4>
function createLevels(max: Level, depth: 3): LevelChildren<3>
function createLevels(max: Level, depth: 2): LevelChildren<2>
function createLevels(max: Level, depth: 1): LevelChildren<1>
function createLevels(max: Level, depth: 0): LevelChildren<0>
function createLevels(max: Level, depth: number): ThemeChildren
function createLevels(max: Level, depth: number): ThemeChildren {
  if (depth === 0) return {}

  const raiseLevel =
    (by: number) =>
    ({ parent }: ThemeDefinitionContext<LevelParent>): ThemeDefinitionObject | null => {
      const current = parent.level ?? 1
      const level = Math.min(current + by, max) as Level
      if (level === current) return null
      return { level, children: createLevels(max, depth - 1) }
    }

  return {
    level2: raiseLevel(1),
    level3: raiseLevel(2),
    level4: raiseLevel(3),
  }
}

export function levels(max: Level = 4): LevelChildren {
  return createLevels(max, 4)
}

export const tree = {
  light: { scheme: 'light', palette: 'gray' },
  dark: { scheme: 'dark', palette: 'gray' },
  children: {
    ...levels(),
    accent: { palette: 'brand', treatment: 'tint', children: levels() },
    brand: { palette: 'brand', treatment: 'bold', children: levels() },
    inverse: ({ parent }: ThemeDefinitionContext) => ({
      scheme: parent.scheme === 'light' ? 'dark' : 'light',
      children: levels(),
    }),
    red: { palette: 'red', treatment: 'tint', children: levels(2) },
    yellow: { palette: 'yellow', treatment: 'tint', children: levels(2) },
    green: { palette: 'green', treatment: 'tint', children: levels(2) },
  },
} as const

export const themes = createThemes(tokens, tree, { getTheme })
