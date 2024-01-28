import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export { rgba } from '@tamagui/normalize-css-color'

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  if (color[0] === '$' || color.startsWith('var(')) {
    return color
  }
  const rgba = getRgba(color)
  if (rgba) {
    const colors = `${rgba.r},${rgba.g},${rgba.b}`
    return opacity === 1 ? `rgb(${colors})` : `rgba(${colors},${opacity ?? rgba.a ?? 1})`
  }
  return color
}

export const getRgba = (color: string) => {
  const colorNum = normalizeCSSColor(color)
  if (colorNum != null) {
    return rgba(colorNum)
  }
}
