import { isWeb } from '@tamagui/constants'
import * as NCC from '@tamagui/normalize-css-color'

export const rgba = NCC.rgba
export const names = NCC.names

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  if (color[0] === '$') return color
  if (isWeb && opacity === 1) return color
  const colorProcessed = NCC.normalizeCSSColor(color)
  if (typeof colorProcessed === 'number') {
    const { r, g, b, a } = rgba(colorProcessed)
    const o = +(opacity ?? a ?? 1)
    const alpha = o.toFixed(2)
    return `rgba(${r},${g},${b},${alpha})`
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
