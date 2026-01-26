import {
  type PaletteAdjustments,
  defaultChildrenThemes,
  adjustPalettes,
} from './v5-themes'

export const v5SubtlePaletteAdjustments: PaletteAdjustments<
  typeof defaultChildrenThemes
> = {
  default: {
    light: (hsl) => ({
      ...hsl,
      s: hsl.s * 0.9,
    }),
    dark: (hsl, i) => ({
      ...hsl,
      s: hsl.s * (i <= 4 ? 0.7 : 0.9),
    }),
  },
  // yellow palette in radix is especially off from the rest
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
      s: hsl.s * (i <= 7 ? 0.45 : 0.55),
      l: hsl.l * (i <= 4 ? 0.8 : 1),
    }),
  },
}

export const subtleChildrenThemes = adjustPalettes(defaultChildrenThemes, {
  ...v5SubtlePaletteAdjustments,
  gray: undefined, // skip
  neutral: undefined, // skip
})
