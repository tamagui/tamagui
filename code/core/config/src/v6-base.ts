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
/**
 * Tailwind's `--container-*` scale, which is width-only by design: `max-w-3xl` is a
 * utility and `h-3xl` is not. It is spread into the width/inline-size domains below
 * and deliberately NOT into any height or block-size domain, so `width="$3xl"` is 768
 * while `height="$3xl"` finds nothing on the shared `size` scale and stays unresolved.
 * Adding it to `height` would invent a Tamagui-only spelling the class path still
 * rejects. Documented for users in `docs/tailwind-mode.md`.
 */
const tailwindContainerSize = {
  '3xs': 256,
  '2xs': 288,
  xs: 320,
  sm: 384,
  md: 448,
  lg: 512,
  xl: 576,
  '2xl': 672,
  '3xl': 768,
  '4xl': 896,
  '5xl': 1024,
  '6xl': 1152,
  '7xl': 1280,
} as const

export const tokens = {
  space: tailwindSpace,
  size: tailwindSize,
  width: {
    ...tailwindSize,
    ...tailwindContainerSize,
  },
  minWidth: { ...tailwindSize, ...tailwindContainerSize },
  maxWidth: { ...tailwindSize, ...tailwindContainerSize },
  inlineSize: { ...tailwindSize, ...tailwindContainerSize },
  minInlineSize: { ...tailwindSize, ...tailwindContainerSize },
  maxInlineSize: { ...tailwindSize, ...tailwindContainerSize },
  flexBasis: { ...tailwindSize, ...tailwindContainerSize },
  outlineWidth: {
    0: 0,
    1: 1,
    2: 2,
    4: 4,
    8: 8,
  },
  outlineOffset: {
    0: 0,
    1: 1,
    2: 2,
    4: 4,
    8: 8,
    '-1': -1,
    '-2': -2,
    '-4': -4,
    '-8': -8,
  },
  boxShadow: {
    '2xs': '0 1px rgb(0 0 0 / 0.05)',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  perspective: {
    dramatic: 100,
    near: 300,
    normal: 500,
    midrange: 800,
    distant: 1200,
  },
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

/**
 * Adds the tailwind type-scale keys (`xs sm base lg xl 2xl ...`) a font needs
 * for the named sizes, which read `sizes.md.fontSize` and so on from the font.
 * Wrap any font you pass to a v6 config with it.
 */
export function withTailwindTypeScale<F extends { size: object; lineHeight: object }>(
  font: F
) {
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

/**
 * Named control sizes as recipes of tailwind token keys. Heights are never set:
 * a control is line-height plus vertical padding tall, so at `md` a button is
 * 20 + 8 + 8 = 36px, shadcn's `h-9 px-4 py-2 text-sm`.
 */
export const sizes = {
  default: 'md',
  xs: { fontSize: 'xs', paddingX: '2', paddingY: '1', radius: 'sm' },
  sm: { fontSize: 'sm', paddingX: '3', paddingY: '1.5', radius: 'md' },
  md: { fontSize: 'sm', paddingX: '4', paddingY: '2', radius: 'md' },
  lg: { fontSize: 'base', paddingX: '6', paddingY: '2', radius: 'md' },
  xl: { fontSize: 'lg', paddingX: '8', paddingY: '2.5', radius: 'lg' },
} as const satisfies NonNullable<CreateTamaguiProps['sizes']>

const alignedConfig = {
  media,
  shorthands,
  fonts,
  sizes,
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
