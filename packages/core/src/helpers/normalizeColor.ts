import normalizeCSSColor from 'normalize-css-color'

export const normalizeColor = (color?: number | string | null, opacity = 1) => {
  if (color == null || color == undefined) {
    return
  }
  if (color[0] === '$') {
    return color
  }
  if (process.env.TAMAGUI_TARGET === 'web') {
    if (typeof color === 'string') {
      if (webColors[color] || color[0] === '_' || color.startsWith('var(')) {
        return color
      }
    }
  }
  const rgba = colorToRGBA(color)
  if (rgba != null) {
    const [r, g, b, a] = rgba
    const alpha = (opacity ?? a).toFixed(2)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return color
}

const webColors = {
  currentColor: true,
  currentcolor: true,
  transparent: true,
  inherit: true,
}

export function colorToRGBA(color: string | number) {
  const colorInt = processColor(color)
  if (colorInt != null) {
    const r = (colorInt >> 16) & 255
    const g = (colorInt >> 8) & 255
    const b = colorInt & 255
    const a = ((colorInt >> 24) & 255) / 255
    return [r, g, b, a] as const
  }
  return null
}

const processColor = (color?: number | string) => {
  if (color === undefined || color === null) {
    return null
  }
  let intColor = normalizeCSSColor(color)
  if (intColor === undefined || intColor === null) {
    return null
  }
  return ((+intColor << 24) | (+intColor >>> 8)) >>> 0
}
