import { isWeb } from '@tamagui/constants'
import * as NCC from '@tamagui/normalize-css-color'

export const rgba = NCC.rgba

export const normalizeColor = (color?: string | null, opacity = 1) => {
  if (!color) return
  if (color === 'transparent') return `rgba(0,0,0,0)`
  if (color[0] === '$') return color
  if (isWeb && opacity === 1) {
    return color
  }
  const colorProcessed = NCC.normalizeCSSColor(color)
  if (colorProcessed) {
    const { r, g, b, a } = rgba(colorProcessed)
    return `rgba(${r},${g},${b},${(opacity ?? a).toFixed(2)})`
  }
  if (process.env.TAMAGUI_TARGET === 'native') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Unknown color value: ${color}`)
    }
    // avoids errors
    return
  }
  return color
}
