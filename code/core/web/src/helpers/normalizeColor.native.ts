import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export { rgba } from '@tamagui/normalize-css-color'

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  // handle dynamic color objects (from $theme-dark/$theme-light)
  if (typeof color !== 'string') return color
  if (color[0] === '$') return color

  const rgbaVal = getRgba(color)
  if (rgbaVal) {
    const colors = `${rgbaVal.r},${rgbaVal.g},${rgbaVal.b}`
    return opacity === 1
      ? `rgb(${colors})`
      : `rgba(${colors},${opacity ?? rgbaVal.a ?? 1})`
  }

  return color
}

export const getRgba = (color: string) => {
  // handle dynamic color objects (from $theme-dark/$theme-light)
  if (typeof color !== 'string') return
  const colorNum = normalizeCSSColor(color)
  if (colorNum != null) {
    return rgba(colorNum)
  }
}
