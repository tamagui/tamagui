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

      // saturation: starts at sStart, ends at sEnd
      const sStart = 0.65
      const sEnd = 0.4

      // lightness: starts at lStart, ends at lEnd
      const lStart = 1.02
      const lEnd = 0.9

      return {
        ...hsl,
        s: hsl.s * (sStart + t * (sEnd - sStart)),
        l: hsl.l * (lStart + t * (lEnd - lStart)),
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
