// web: use color-mix for opacity (CSS-native, works with variables and named colors)
// animation drivers that need rgba handle their own conversion

import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  if (typeof color !== 'string') return color

  if (color === 'transparent') {
    return 'rgba(0, 0, 0, 0)'
  }

  if (typeof opacity === 'number' && opacity < 1) {
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
