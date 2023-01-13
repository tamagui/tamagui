import { isWeb } from '@tamagui/constants'
import normalizeCSSColor, { rgba } from '@tamagui/normalize-css-color'

export { rgba } from '@tamagui/normalize-css-color'

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
  const colorProcessed = normalizeCSSColor(color)
  if (colorProcessed !== null) {
    const { r, g, b, a } = rgba(colorProcessed)
    return `rgba(${r},${g},${b},${a.toFixed(2)})`
  }

  return color
}

const webColors = {
  currentColor: true,
  currentcolor: true,
  inherit: true,
}
