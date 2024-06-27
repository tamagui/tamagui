import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export { rgba } from '@tamagui/normalize-css-color'

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  if (color[0] === '$') return color
  if (color.startsWith('var(')) {
    if (typeof opacity === 'number' && opacity < 1) {
      return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`
    }
  } else {
    const rgba = getRgba(color)
    if (rgba) {
      const colors = `${rgba.r},${rgba.g},${rgba.b}`
      return opacity === 1
        ? `rgb(${colors})`
        : `rgba(${colors},${opacity ?? rgba.a ?? 1})`
    }
  }
  return color
}

export const getRgba = (color: string) => {
  const colorNum = normalizeCSSColor(color)
  if (colorNum != null) {
    return rgba(colorNum)
  }
}
