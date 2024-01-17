import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export { rgba } from '@tamagui/normalize-css-color'

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  if (color[0] === '$' || color.startsWith('var(')) {
    return color
  }
  const rgba = getRgba(color)
  if (rgba) {
    return `rgba(${rgba.r},${rgba.g},${rgba.b},${opacity ?? rgba.a ?? 1})`
  }
  return color
}

export const getRgba = (color: string) => {
  const colorNum = normalizeCSSColor(color)
  if (colorNum != null) {
    return rgba(colorNum)
  }
}
