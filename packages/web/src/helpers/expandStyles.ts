import { getConfig } from '../config'
import { expandStyle } from './expandStyle'
import { normalizeShadow } from './normalizeShadow'
import { normalizeValueWithProperty } from './normalizeValueWithProperty.js'
import { pseudoDescriptors } from './pseudoDescriptors'

let shorthands: Record<string, string> | null = null
export const defaultOffset = { height: 0, width: 0 }

/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Turns user shorthands into longhands, ie px = paddingHorizontal
 *   2. Normalizes various inconsistent styles to be more consistent
 *   3. Expands react-native shorthands, ie paddingHorizontal => paddingLeft, paddingRight
 */

export function expandStyles(style: Record<string, any>, config = getConfig()) {
  const res: Record<string, any> = {}

  for (let key in style) {
    shorthands = shorthands || (config ? config.shorthands : null)
    if (shorthands) {
      key = shorthands[key] || key
    }
    if (key in pseudoDescriptors) {
      res[key] = expandStyles(style[key])
      continue
    }
    const val = normalizeValueWithProperty(style[key], key)
    // expand react-native shorthands
    const out = expandStyle(key, val)
    if (out) {
      Object.assign(res, Object.fromEntries(out))
    } else {
      res[key] = val
    }
  }

  fixStyles(res)

  return res
}

export function fixStyles(style: Record<string, any>) {
  if (
    style.shadowRadius ||
    style.shadowColor ||
    style.shadowOpacity ||
    style.shadowOffset
  ) {
    Object.assign(style, normalizeShadow(style))
  }

  // TODO could be native-only
  // ensure border style set by default to solid
  for (const key in borderDefaults) {
    if (key in style && !style[borderDefaults[key]]) {
      style[borderDefaults[key]] = 'solid'
    }
  }
}

const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderTopWidth: 'borderTopStyle',
  borderLeftWidth: 'borderLeftStyle',
  borderRightWidth: 'borderRightStyle',
}
