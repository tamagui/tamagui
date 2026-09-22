import {
  createThemes,
  type GetThemeContext,
  type ThemeChildren,
  type ThemeDefinitionContext,
  type ThemeDefinitionObject,
} from '@tamagui/create-theme'

import { tokens, type ColorTokenName } from './tokens'

export { createThemes } from '@tamagui/create-theme'
export type { GetThemeContext, ThemeDefinitionContext } from '@tamagui/create-theme'
export { colorTokens, tailwindColors, tokens } from './tokens'

export const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

// shadows are theme values, not tokens: a shadow that reads at all on a light
// surface disappears on a dark one, so each scheme carries its own ladder.
export const shadows = {
  light: {
    'shadow-1': 'rgba(0, 0, 0, 0.03)',
    'shadow-2': 'rgba(0, 0, 0, 0.06)',
    'shadow-3': 'rgba(0, 0, 0, 0.1)',
    'shadow-4': 'rgba(0, 0, 0, 0.17)',
    'shadow-5': 'rgba(0, 0, 0, 0.26)',
    'shadow-6': 'rgba(0, 0, 0, 0.36)',
    'shadow-7': 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    'shadow-1': 'rgba(0, 0, 0, 0.15)',
    'shadow-2': 'rgba(0, 0, 0, 0.23)',
    'shadow-3': 'rgba(0, 0, 0, 0.33)',
    'shadow-4': 'rgba(0, 0, 0, 0.45)',
    'shadow-5': 'rgba(0, 0, 0, 0.65)',
    'shadow-6': 'rgba(0, 0, 0, 0.8)',
    'shadow-7': 'rgba(0, 0, 0, 0.9)',
  },
} as const

export type ShadowName = keyof (typeof shadows)['light']

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
] as const

export type SemanticThemeKey = (typeof semanticThemeKeys)[number]
export type ThemeScale<TokenName extends string = ColorTokenName> = Record<
  Exclude<SemanticThemeKey, 'shadow-color'>,
  Shade | TokenName
> & { 'shadow-color': ShadowName }

// hover always steps paler and press always steps deeper, in both schemes: that is
// what a lift and a push read as, regardless of scheme. the light ground therefore
// sits one rung off pure white, because a ground pinned to white leaves hover
// nowhere to go and forces it to darken, which reads as the surface receding.
const light = {
  background: 50,
  'background-hover': 'white',
  'background-press': 100,
  'background-focus': 'white',
  'background-active': 'white',
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
  'background-press': 'black',
  'background-focus': 900,
  'background-active': 900,
  'border-color': 800,
  'border-color-hover': 700,
  'border-color-press': 800,
  'border-color-focus': 700,
  color: 50,
  'color-hover': 50,
  'color-press': 50,
  'color-focus': 50,
  'shadow-color': 'shadow-3',
} as const satisfies ThemeScale

const boldLight = {
  background: 600,
  'background-hover': 500,
  'background-press': 700,
  'background-focus': 500,
  'background-active': 500,
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
  'background-press': 600,
  'background-focus': 400,
  'background-active': 400,
  'border-color': 600,
  'border-color-hover': 500,
  'border-color-press': 600,
  'border-color-focus': 500,
  'shadow-color': 'shadow-3',
} as const satisfies ThemeScale

const tintLight = {
  background: 100,
  'background-hover': 50,
  'background-press': 200,
  'background-focus': 50,
  'background-active': 50,
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
  'background-press': 950,
  'background-focus': 800,
  'background-active': 800,
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
  'shadow-color': 'shadow-3',
} as const satisfies ThemeScale

const ladder = ['white', ...shades, 'black'] as const

export function raise<TokenName extends string>(
  scale: ThemeScale<TokenName>,
  steps: number
): ThemeScale<TokenName> {
  return Object.fromEntries(
    Object.entries(scale).map(([key, value]) => {
      if (!key.startsWith('background') && !key.startsWith('border-color')) {
        return [key, value]
      }
      const index = ladder.indexOf(value as (typeof ladder)[number])
      if (index === -1) return [key, value]
      return [key, ladder[Math.max(0, Math.min(ladder.length - 1, index + steps))]]
    })
  ) as ThemeScale<TokenName>
}

// a level steps the surface AWAY from the page ground, so it stands out more:
// deeper in light, paler in dark. one rung per level, because the neutral ramp is
// monotonic now: a rung is worth about 5 points of perceptual lightness at the pale
// end and 10-15 at the dark end, which reads in both. this deliberately does NOT
// accelerate. it used to, purely to escape tailwind gray's squashed pale end, and
// against a monotonic ramp that acceleration overshoots instead, jumping the first
// dark level 25 points into mid-grey.
const levelSteps = [0, 1, 2, 3] as const

// tint grounds mid-ramp with its type only a few rungs away, so walking just the
// background closes the contrast gap: light tint is already at 4.5:1 on its ground
// and fails at every step past it. its levels walk the type along with the surface
// and step one rung at a time, which caps tint at three real levels: a fourth lands
// on 400, which drops under 4.5:1 against every type shade the ramp still has.
const tintSteps = [0, 1, 2, 2] as const
const tintType = { light: [700, 800, 900, 900], dark: [200, 100, 50, 50] } as const

function tintLevel<TokenName extends string>(
  scale: ThemeScale<TokenName>,
  scheme: Scheme,
  level: Level
): ThemeScale<TokenName> {
  const steps = scheme === 'light' ? tintSteps[level - 1] : -tintSteps[level - 1]
  const color = tintType[scheme][level - 1]
  return {
    ...raise(scale, steps),
    color,
    'color-hover': color,
    'color-press': color,
    'color-focus': color,
  }
}

// the selected state: the background moves to the scale's `background-active`
// rung, which sits one step toward white from the resting background in every
// scale, and every hover/press/focus shift pins to its resting value, because
// a selected surface has no hover or press state. the ramp is untouched:
// color-1..color-11 stay absolute rungs in every state. `raise` walks
// `background-active` alongside `background`, so levels keep the same
// one-rung relationship without special handling here.
export function activeScale<TokenName extends string>(
  scale: ThemeScale<TokenName>
): ThemeScale<TokenName> {
  const background = scale['background-active']
  return {
    ...scale,
    background,
    'background-hover': background,
    'background-press': background,
    'background-focus': background,
    'border-color-hover': scale['border-color'],
    'border-color-press': scale['border-color'],
    'border-color-focus': scale['border-color'],
    'color-hover': scale.color,
    'color-press': scale.color,
    'color-focus': scale.color,
  }
}

export const scales = {
  normal: {
    light: {
      1: light,
      2: raise(light, levelSteps[1]),
      3: raise(light, levelSteps[2]),
      4: raise(light, levelSteps[3]),
    },
    dark: {
      1: dark,
      2: raise(dark, -levelSteps[1]),
      3: raise(dark, -levelSteps[2]),
      4: raise(dark, -levelSteps[3]),
    },
  },
  // brand is already the loudest surface in the system, so it does not nest: a
  // level under it has nowhere louder to go. these stay flat so a stray nesting
  // is a no-op rather than a wrong-direction shift.
  bold: {
    light: { 1: boldLight, 2: boldLight, 3: boldLight, 4: boldLight },
    dark: { 1: boldDark, 2: boldDark, 3: boldDark, 4: boldDark },
  },
  tint: {
    light: {
      1: tintLight,
      2: tintLevel(tintLight, 'light', 2),
      3: tintLevel(tintLight, 'light', 3),
      4: tintLevel(tintLight, 'light', 4),
    },
    dark: {
      1: tintDark,
      2: tintLevel(tintDark, 'dark', 2),
      3: tintLevel(tintDark, 'dark', 3),
      4: tintLevel(tintDark, 'dark', 4),
    },
  },
} as const

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

// color-1 sits nearest the background and color-11 nearest the type in every
// theme. the scheme alone gets that wrong for a scale whose background is
// deeper than its type (bold in light), so when the scale is given it decides
// the direction and the scheme is only the fallback for values off the ladder.
export function rampReversed(scheme: Scheme, scale?: ThemeScale<string>): boolean {
  if (scale) {
    const background = ladder.indexOf(scale.background as (typeof ladder)[number])
    const color = ladder.indexOf(scale.color as (typeof ladder)[number])
    if (background !== -1 && color !== -1) return background > color
  }
  return scheme === 'dark'
}

export function ramp<const PaletteName extends string>(
  palette: PaletteName,
  scheme: Scheme,
  scale?: ThemeScale<string>
): Ramp<PaletteName> {
  const ordered = rampReversed(scheme, scale) ? [...shades].reverse() : shades
  return Object.fromEntries(
    ordered.map((shade, index) => [`color-${index + 1}`, `${palette}-${shade}`])
  ) as Ramp<PaletteName>
}

export function fromShades<const PaletteName extends string, TokenName extends string>(
  palette: PaletteName,
  scale: ThemeScale<TokenName>
): Record<SemanticThemeKey, `${PaletteName}-${Shade}` | TokenName> {
  return Object.fromEntries(
    Object.entries(scale).map(([key, value]) => [
      key,
      typeof value === 'number' ? `${palette}-${value}` : value,
    ])
  ) as Record<SemanticThemeKey, `${PaletteName}-${Shade}` | TokenName>
}

export function getTheme({ recipe }: GetThemeContext<typeof tokens, DefaultRecipe>) {
  const resting = scales[recipe.treatment ?? 'normal'][recipe.scheme][recipe.level ?? 1]
  const scale = recipe.active ? activeScale(resting) : resting
  const schemeShadows = shadows[recipe.scheme]
  return {
    ...ramp(recipe.palette, recipe.scheme, scale),
    ...fromShades(recipe.palette, scale),
    ...schemeShadows,
    // the scale names a step on the ladder; the scheme decides what it is worth
    'shadow-color': schemeShadows[scale['shadow-color']],
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
  light: { scheme: 'light', palette: 'mauve' },
  dark: { scheme: 'dark', palette: 'mauve' },
  children: {
    ...levels(),
    accent: { palette: 'brand', treatment: 'tint', children: levels(3) },
    // brand is the emphasis surface, and in v3 emphasis means the high contrast
    // flip of whatever it sits on: a checked checkbox, an "on" toggle, a
    // tooltip, a primary button. it resolves to the same theme as `inverse`,
    // and the separate name is what a design system redefines when it wants its
    // own emphasis look without touching what `inverse` means.
    brand: ({ parent }: ThemeDefinitionContext) => ({
      scheme: parent.scheme === 'light' ? 'dark' : 'light',
      children: levels(),
    }),
    inverse: ({ parent }: ThemeDefinitionContext) => ({
      scheme: parent.scheme === 'light' ? 'dark' : 'light',
      children: levels(),
    }),
    // the selected state. the marker rides the recipe (not `values`) so it
    // survives deeper nesting: anything mounted under an active theme stays
    // active until a definition clears it.
    active: { active: true, children: levels() },
    // black and white name a scheme outright, where `inverse` only flips
    // whichever one the parent happened to be. a menu that has to read as dark
    // over a light page asks for `black` and gets it wherever it is mounted.
    // both resolve from any parent, so `light_black` and `dark_black` are the
    // same theme as `dark`, and deduplicate onto it.
    black: { scheme: 'dark', children: levels() },
    white: { scheme: 'light', children: levels() },
    red: { palette: 'red', treatment: 'tint', children: levels(3) },
    yellow: { palette: 'yellow', treatment: 'tint', children: levels(3) },
    green: { palette: 'green', treatment: 'tint', children: levels(3) },
  },
} as const

export const themes = createThemes(tokens, tree, { getTheme })
