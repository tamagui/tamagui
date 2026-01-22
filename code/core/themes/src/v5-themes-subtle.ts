/**
 * Subtle v5 themes - pre-built desaturated color themes
 */

export * from './v5-themes'

import {
  adjustPalettes,
  createV5Theme,
  defaultChildrenThemes,
  type PaletteAdjustments,
} from './v5-themes'

export const v5SubtlePaletteAdjustments: PaletteAdjustments<
  typeof defaultChildrenThemes
> = {
  default: {
    light: (hsl) => ({
      ...hsl,
      s: hsl.s * 0.9,
      l: hsl.l * 1.02,
    }),
    dark: (hsl, i) => ({
      ...hsl,
      s: hsl.s * (i <= 4 ? 0.5 : 0.9),
      l: hsl.l * (i <= 4 ? 0.65 : 0.88),
    }),
  },
  yellow: {
    light: (hsl, i) => {
      // progressively darken and desaturate toward text colors for better contrast
      // i=1 is lightest bg, i=12 is darkest text
      const t = (i - 1) / 11 // 0 to 1
      return {
        ...hsl,
        s: hsl.s * (0.65 - t * 0.25), // 0.65 -> 0.4
        l: hsl.l * (1.02 - t * 0.22), // 1.02 -> 0.8
      }
    },
    dark: (hsl, i) => ({
      ...hsl,
      s: hsl.s * (i <= 7 ? 0.24 : 0.6),
      l: hsl.l * (i <= 4 ? 0.65 : 1.1),
    }),
  },
}

export const subtleChildrenThemes = adjustPalettes(defaultChildrenThemes, {
  ...v5SubtlePaletteAdjustments,
  gray: undefined, // skip
  neutral: undefined, // skip
})

export const themes = createV5Theme({ childrenThemes: subtleChildrenThemes })

// type checks - don't remove
themes.dark.background0075
themes.dark_yellow.background0075
themes.dark.background
themes.dark.accent1
// @ts-expect-error
themes.dark.nonValid
