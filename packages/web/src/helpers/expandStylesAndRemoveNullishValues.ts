import { expandStyle } from './expandStyle'
import { fixStyles } from './expandStyles'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { pseudoDescriptors } from './pseudoDescriptors'

/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Turns user shorthands into longhands, ie px = paddingHorizontal
 *   2. Normalizes various inconsistent styles to be more consistent
 *   3. Expands react-native shorthands, ie paddingHorizontal => paddingLeft, paddingRight
 */

export function expandStylesAndRemoveNullishValues(
  style: Record<string, any>,
  disableNormalize = false
) {
  const res: Record<string, any> = {}

  for (let key in style) {
    const prop = style[key]
    if (prop == null) continue
    if (key in pseudoDescriptors) {
      res[key] = expandStylesAndRemoveNullishValues(prop, disableNormalize)
      continue
    }
    const value = disableNormalize ? prop : normalizeValueWithProperty(prop, key)
    // expand react-native shorthands
    const out = expandStyle(key, value)
    if (out) {
      Object.assign(res, Object.fromEntries(out))
    } else {
      res[key] = value
    }
  }

  fixStyles(res)

  return res
}
