// the aligned v6 base: Tailwind-aligned shorthands, scales, fonts, media and settings.
// colors and themes are deliberately separate so createV6Config can accept any pack.
import { shorthands } from '@tamagui/shorthands/v6'
import type { CreateTamaguiProps } from '@tamagui/web'
import { fonts as systemFonts } from './fonts'
import { media } from './media'
import { selectionStyles, settings as baseSettings } from './settings'
import {
  tailwindFontSize,
  tailwindLineHeight,
  tailwindRadius,
  tailwindSize,
  tailwindSpace,
} from './v6-tailwind-scales.generated'
import {
  v6RemovedThemeNames,
  v6ThemeNameReplacements,
} from '@tamagui/style-grammar/v6-themes'

export { shorthands }
export { createSystemFont } from './fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './media'
export { selectionStyles }
export { tailwindSource } from './v6-tailwind-scales.generated'
export { v6RemovedThemeNames, v6ThemeNameReplacements }
export { toV6Themes, type V6Theme, type V6Themes } from './v6-themes'
// space and size deliberately remain separate configured domains even though their default
// values coincide. z-index is literal, so its identity scale is not configured as tokens.
export const tokens = {
  space: tailwindSpace,
  size: tailwindSize,
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 7,
    4: 9,
    5: 10,
    6: 16,
    7: 19,
    8: 22,
    9: 26,
    10: 34,
    11: 42,
    12: 50,
    ...tailwindRadius,
  },
} as const

function withTailwindTypeScale<F extends { size: object; lineHeight: object }>(font: F) {
  return {
    ...font,
    size: { ...font.size, ...tailwindFontSize },
    lineHeight: { ...font.lineHeight, ...tailwindLineHeight },
  }
}

export const fonts = {
  body: withTailwindTypeScale(systemFonts.body),
  heading: withTailwindTypeScale(systemFonts.heading),
} satisfies NonNullable<CreateTamaguiProps['fonts']>

export const settings = {
  ...baseSettings,
} satisfies CreateTamaguiProps['settings']

export type V6Settings = typeof settings

/**
 * A v6 colors pack: the one seam where color choice enters the config.
 * Themes should be generated from the same palette as the color tokens.
 */
export type V6Colors = {
  themes: NonNullable<CreateTamaguiProps['themes']>
  /** flat named colors added at tokens.color */
  colorTokens?: Record<string, string>
  /** extra 12-step color scales merged into the light and dark base themes */
  scales?: V6ColorScales
}

type Twelve<Value> = readonly [
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
]

/** one 12-step scale, light and dark values from step 1 (faintest) to 12 (strongest) */
export type V6ColorScale = {
  light: Twelve<string>
  dark: Twelve<string>
}

export type V6ColorScales = Record<string, V6ColorScale>

type ScaleStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type ColorScaleThemeKeys<Scales extends V6ColorScales> = {
  [Name in keyof Scales & string as `${Name}${ScaleStep}`]: string
}

type WithColorScales<
  Themes extends Record<string, object>,
  Scales extends V6ColorScales,
> = {
  [Name in keyof Themes]: Name extends 'light' | 'dark'
    ? Themes[Name] & ColorScaleThemeKeys<Scales>
    : Themes[Name]
}

// scale keys land only on the base light/dark themes; every subtheme reaches
// them through parent fallback, so the CSS carries each value once
function themesWithColorScales<
  Themes extends Record<string, object>,
  Scales extends V6ColorScales,
>(themes: Themes, scales: Scales): WithColorScales<Themes, Scales> {
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}
  for (const name in scales) {
    const scale = scales[name]
    if (scale.light.length !== 12 || scale.dark.length !== 12) {
      throw new Error(
        `color scale "${name}" needs exactly 12 light and 12 dark values, got ${scale.light.length}/${scale.dark.length}`
      )
    }
    scale.light.forEach((value, index) => {
      light[`${name}${index + 1}`] = value
    })
    scale.dark.forEach((value, index) => {
      dark[`${name}${index + 1}`] = value
    })
  }
  return {
    ...themes,
    light: { ...themes.light, ...light },
    dark: { ...themes.dark, ...dark },
  } as WithColorScales<Themes, Scales>
}

const alignedConfig = {
  media,
  shorthands,
  fonts,
  selectionStyles,
  settings,
}

/** Compose the aligned v6 base with a colors pack into a createTamagui-ready config. */
export function createV6Config<
  Themes extends NonNullable<CreateTamaguiProps['themes']>,
  ColorTokens extends Record<string, string>,
  Scales extends V6ColorScales = Record<never, V6ColorScale>,
>(colors: {
  themes: Themes
  colorTokens: ColorTokens
  scales?: Scales
}): typeof alignedConfig & {
  themes: WithColorScales<Themes, Scales>
  tokens: typeof tokens & { color: ColorTokens }
}
export function createV6Config<
  Themes extends NonNullable<CreateTamaguiProps['themes']>,
  Scales extends V6ColorScales = Record<never, V6ColorScale>,
>(colors: {
  themes: Themes
  colorTokens?: undefined
  scales?: Scales
}): typeof alignedConfig & {
  themes: WithColorScales<Themes, Scales>
  tokens: typeof tokens
}
export function createV6Config(colors: V6Colors) {
  return {
    ...alignedConfig,
    themes: colors.scales
      ? themesWithColorScales(colors.themes, colors.scales)
      : colors.themes,
    tokens: colors.colorTokens ? { ...tokens, color: colors.colorTokens } : tokens,
  }
}
