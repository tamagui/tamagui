// the aligned v6 base: Tailwind-aligned shorthands, scales, fonts, media and settings.
// colors and themes are deliberately not here — they are the divergent piece. pick a pack:
//   @tamagui/config/v6          Tailwind palette + themes generated from it
//   @tamagui/config/v6-classic  the v5 color story (generated v5 themes, no color tokens)
//   createV6Config(colors)      bring your own (generate via @tamagui/config/v6-builder)
import { shorthands } from '@tamagui/shorthands/v6'
import { tokens as v5tokens } from '@tamagui/themes/v5-tokens'
import type { CreateTamaguiProps } from '@tamagui/web'
import { fonts as v5fonts } from './v5-fonts'
import { media } from './v5-media'
import { selectionStyles, settings as v5Settings } from './v5-settings'
import {
  tailwindFontSize,
  tailwindLineHeight,
  tailwindRadius,
  tailwindSize,
  tailwindSpace,
  tailwindZIndex,
} from './v6-tailwind-scales.generated'

export { shorthands }
export { createSystemFont } from './v5-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './v5-media'
export { selectionStyles }
export { tailwindSource } from './v6-tailwind-scales.generated'

// Space and size deliberately remain separate configured domains even though their default
// values coincide. Radius keeps v5's numeric component scale while adding Tailwind's named
// border-radius scale; v6's z-index names resolve to their direct CSS values.
export const tokens = {
  space: tailwindSpace,
  size: tailwindSize,
  radius: { ...v5tokens.radius, ...tailwindRadius },
  zIndex: tailwindZIndex,
} as const

// Font px strings are normalized to numeric Variable values by createVariable. Keep the same
// public numeric type contract as v5's pinFontToPx while retaining the generated map's exact keys.
type NormalizedPxScale<T extends Record<string, string>> = {
  [Key in keyof T]: number
}

const asNormalizedPxScale = <T extends Record<string, string>>(scale: T) =>
  scale as unknown as NormalizedPxScale<T>

function withTailwindTypeScale<F extends { size: object; lineHeight: object }>(font: F) {
  return {
    ...font,
    size: { ...font.size, ...asNormalizedPxScale(tailwindFontSize) },
    lineHeight: { ...font.lineHeight, ...asNormalizedPxScale(tailwindLineHeight) },
  }
}

export const fonts = {
  body: withTailwindTypeScale(v5fonts.body),
  heading: withTailwindTypeScale(v5fonts.heading),
} satisfies NonNullable<CreateTamaguiProps['fonts']>

export const settings = {
  ...v5Settings,
  defaultSize: '$11',
  defaultTokens: {
    space: '$4',
    radius: '$4',
    zIndex: '$4',
    fontSize: '$4',
  },
} satisfies CreateTamaguiProps['settings']

export type V6Settings = typeof settings

/**
 * A v6 colors pack: the one seam where color choice enters the config.
 * Themes should be generated from the same palette the color tokens come from —
 * see `@tamagui/config/v6-builder` (and `@tamagui/themes/v5-builder`).
 */
export type V6Colors = {
  themes: NonNullable<CreateTamaguiProps['themes']>
  /** flat named colors added at tokens.color — omit to keep colors theme-only (like v5) */
  colorTokens?: Record<string, string>
}

/** Compose the aligned v6 base with a colors pack into a createTamagui-ready config. */
export function createV6Config<Colors extends V6Colors>(colors: Colors) {
  return {
    media,
    shorthands,
    fonts,
    selectionStyles,
    settings,
    themes: colors.themes as Colors['themes'],
    tokens: {
      ...tokens,
      ...(colors.colorTokens && { color: colors.colorTokens }),
    } as Colors['colorTokens'] extends Record<string, string>
      ? typeof tokens & { color: Colors['colorTokens'] }
      : typeof tokens,
  }
}
