// web: use color-mix for CSS variables, rgba for concrete colors

import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  // handle dynamic color objects (from $theme-dark/$theme-light)
  if (typeof color !== 'string') return color

  // convert "transparent" to rgba for animation compatibility (motion.dev requires rgba)
  if (color === 'transparent') {
    return 'rgba(0, 0, 0, 0)'
  }

  if (typeof opacity === 'number' && opacity < 1) {
    // CSS variables can't be parsed — use color-mix (Chrome 111+, Safari 16.2+, Firefox 113+)
    if (color.startsWith('var(')) {
      return `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
    }
    // concrete colors: parse to rgba so JS animation drivers can interpolate
    const parsed = getRgba(color)
    if (parsed) {
      return `rgba(${parsed.r},${parsed.g},${parsed.b},${opacity})`
    }
    // fallback to color-mix if parsing fails
    return `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
  }

  return color
}

export const getRgba = (
  color: string
): { r: number; g: number; b: number; a: number } | undefined => {
  if (typeof color !== 'string') return
  const colorNum = normalizeCSSColor(color)
  if (colorNum != null) {
    return rgba(colorNum)
  }
}
