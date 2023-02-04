import { isWeb } from '@tamagui/constants'
import * as NCC from '@tamagui/normalize-css-color'

export const rgba = NCC.rgba

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (color === null || color === undefined) {
    return
  }
  if (color === 'transparent') {
    return `rgba(0,0,0,0)`
  }
  if (
    color[0] === '$' ||
    (isWeb && (webColors[color] || color[0] === '_' || color.startsWith('var(')))
  ) {
    return color
  }
  const colorProcessed = NCC.normalizeCSSColor(color)
  if (colorProcessed !== null) {
    const { r, g, b, a } = rgba(colorProcessed)
    return `rgba(${r},${g},${b},${(opacity ?? a).toFixed(2)})`
  }

  if (isWeb) {
    return color
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Unknown color value: ${color}`)
    }
  }
}

const webColors = {
  currentColor: true,
  currentcolor: true,
  inherit: true,
}
