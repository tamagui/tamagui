import normalizeCSSColor from 'normalize-css-color'

export const normalizeColor = (color?: number | string, opacity = 1): void | string => {
  if (color == null) return
  if (typeof color === 'string' && isWebColor(color)) {
    return color
  }
  const colorInt = processColor(color)
  if (colorInt != null) {
    const r = (colorInt >> 16) & 255
    const g = (colorInt >> 8) & 255
    const b = colorInt & 255
    const a = ((colorInt >> 24) & 255) / 255
    const alpha = (a * opacity).toFixed(2)
    return `rgba(${r},${g},${b},${alpha})`
  }
}

const isWebColor = (color: string): boolean =>
  color === 'currentcolor' ||
  color === 'currentColor' ||
  color === 'inherit' ||
  color.indexOf('var(') === 0

const processColor = (color?: string | number): number | undefined => {
  if (color === undefined || color === null) {
    return color
  }
  // convert number and hex
  let int32Color = normalizeCSSColor(color)
  if (int32Color === undefined || int32Color === null) {
    return undefined
  }
  // @ts-ignore
  int32Color = ((int32Color << 24) | (int32Color >>> 8)) >>> 0
  // @ts-ignore
  return int32Color
}
