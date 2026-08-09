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

export { shorthands }
export { createSystemFont } from './fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './media'
export { selectionStyles }
export { tailwindSource } from './v6-tailwind-scales.generated'
export {
  v6RemovedThemeNames,
  v6ThemeNameReplacements,
} from '@tamagui/style-grammar/tooling'
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
>(colors: {
  themes: Themes
  colorTokens: ColorTokens
}): typeof alignedConfig & {
  themes: Themes
  tokens: typeof tokens & { color: ColorTokens }
}
export function createV6Config<
  Themes extends NonNullable<CreateTamaguiProps['themes']>,
>(colors: {
  themes: Themes
  colorTokens?: undefined
}): typeof alignedConfig & {
  themes: Themes
  tokens: typeof tokens
}
export function createV6Config(colors: V6Colors) {
  return {
    ...alignedConfig,
    themes: colors.themes,
    tokens: colors.colorTokens ? { ...tokens, color: colors.colorTokens } : tokens,
  }
}
