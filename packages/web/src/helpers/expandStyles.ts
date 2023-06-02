import { isWeb } from '@tamagui/constants'

import { getConfig } from '../config'
import { expandStyle } from './expandStyle'
import { normalizeShadow } from './normalizeShadow'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { pseudoDescriptors } from './pseudoDescriptors'

/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Turns user shorthands into longhands, ie px = paddingHorizontal
 *   2. Normalizes various inconsistent styles to be more consistent
 *   3. Expands react-native shorthands, ie paddingHorizontal => paddingLeft, paddingRight
 */

export function expandStyles(style: Record<string, any>, { shorthands } = getConfig()) {
  const res: Record<string, any> = {}

  for (let key in style) {
    const valIn = style[key]
    key = shorthands?.[key] || key
    if (key in pseudoDescriptors) {
      res[key] = expandStyles(valIn)
      continue
    }
    const val = normalizeValueWithProperty(valIn, key)
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

// native doesn't support specific border edge style
const nativeStyle = isWeb ? null : 'borderStyle'
const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: nativeStyle || 'borderBottomStyle',
  borderTopWidth: nativeStyle || 'borderTopStyle',
  borderLeftWidth: nativeStyle || 'borderLeftStyle',
  borderRightWidth: nativeStyle || 'borderRightStyle',
}
