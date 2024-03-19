import * as normalizeColor from '@react-native/normalize-color'

// vite/webpack compat
const norm = normalizeColor.default || normalizeColor
export const normalizeCSSColor = norm as (color: string) => number | null

export function rgba(colorInt: number) {
  const r = Math.round((colorInt & 0xff000000) >>> 24)
  const g = Math.round((colorInt & 0x00ff0000) >>> 16)
  const b = Math.round((colorInt & 0x0000ff00) >>> 8)
  const a = ((colorInt & 0x000000ff) >>> 0) / 255
  return {
    r,
    g,
    b,
    a,
  }
}

export default normalizeCSSColor
