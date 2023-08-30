import { isWeb } from '@tamagui/constants'
import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export { rgba } from '@tamagui/normalize-css-color'

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  if (color[0] === '$' || (color[0] === 'v' && color.startsWith('var('))) {
    return color
  }
  if (isWeb && opacity === 1) {
    return color
  }
  const colorProcessed = normalizeCSSColor(color)
  if (colorProcessed != null) {
    const { r, g, b, a } = rgba(colorProcessed)
    const o = opacity ?? a ?? 1
    const alpha = o.toFixed(2)
    return `rgba(${r},${g},${b},${alpha})`
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Unknown color value: ${color}`)
  }
  if (process.env.TAMAGUI_TARGET === 'native') {
    // avoids errors
    return
  }
  // on web pass it through could be a var or something
  return color
}
