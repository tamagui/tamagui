import * as normalizeColor from '@react-native/normalize-color'

export { rgba } from './rgba'

// vite/webpack compat
const norm = normalizeColor.default || normalizeColor
export const normalizeCSSColor = norm as (color: string) => number | null

// alphabetic strings RN's normalize-color accepts are exactly the named colors
export function isKnownColorName(color: string): boolean {
  return /^[a-z]+$/i.test(color) && normalizeCSSColor(color) != null
}

export default normalizeCSSColor
