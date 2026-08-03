import * as normalizeColor from '@react-native/normalize-color'

export { rgba } from './rgba'

// vite/webpack compat
const norm = normalizeColor.default || normalizeColor
export const normalizeCSSColor = norm as (color: string) => number | null

export default normalizeCSSColor
