import { expandStyle } from './expandStyle'
import { fixStyles } from './expandStyles'
import { isObj } from './isObj'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { pseudoDescriptors } from './pseudoDescriptors'
import { styleOriginalValues } from './styleOriginalValues'

/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Shorthands into longhands, px = paddingHorizontal
 *   2. Expands flex, borderColor and other properties that can expand into sub-parts
 *   3. Normalizes all sub pseudo-media-etc styles
 */

export function normalizeStyle(style: Record<string, any>, disableNormalize = false) {
  const res: Record<string, any> = {}
  const originalValues = styleOriginalValues.get(style)
  let nextOriginalValues: Record<string, any> | undefined

  for (let key in style) {
    const prop = style[key]
    if (prop == null) continue
    const originalValue = originalValues?.[key]
    if (
      key in pseudoDescriptors ||
      // this should capture all parent-based styles like media, group, etc
      (key[0] === '$' && isObj(prop))
    ) {
      res[key] = normalizeStyle(prop, disableNormalize)
      if (originalValue !== undefined) {
        nextOriginalValues ||= {}
        nextOriginalValues[key] = originalValue
      }
      continue
    }
    const value = disableNormalize ? prop : normalizeValueWithProperty(prop, key)
    // expand react-native shorthands
    const out = expandStyle(key, value)
    if (out) {
      for (const [nextKey, nextValue] of out) {
        res[nextKey] = nextValue
        if (originalValue !== undefined) {
          nextOriginalValues ||= {}
          nextOriginalValues[nextKey] = originalValue
        }
      }
    } else {
      res[key] = value
      if (originalValue !== undefined) {
        nextOriginalValues ||= {}
        nextOriginalValues[key] = originalValue
      }
    }
  }

  fixStyles(res)

  if (nextOriginalValues) {
    styleOriginalValues.set(res, nextOriginalValues)
  }

  return res
}
