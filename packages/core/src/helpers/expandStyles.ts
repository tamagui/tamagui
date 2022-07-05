import { getConfig } from '../conf'
import { isWeb } from '../constants/platform'
import { expandStyle } from './expandStyle'
import { colorToRGBA, normalizeColor } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
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

export function expandStyles(style: Record<string, any>) {
  const res: Record<string, any> = {}

  for (let key in style) {
    shorthands = shorthands || getConfig().shorthands
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
  if (style.shadowRadius) {
    Object.assign(style, normalizeShadow(style))
  }

  // ensure border style set by default to solid
  for (const key in borderDefaults) {
    if (style[key] && !style[borderDefaults[key]]) {
      style[borderDefaults[key]] = 'solid'
    }
  }
}

function normalizeShadow({
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
}: Record<string, any>) {
  const { height, width } = shadowOffset || defaultOffset
  const colorStr = String(shadowColor || 'black')
  return {
    shadowOffset: {
      width: normalizeValueWithProperty(width || 0),
      height: normalizeValueWithProperty(height || 0),
    },
    shadowRadius: normalizeValueWithProperty(shadowRadius || 0),
    ...(isWeb && {
      shadowColor: normalizeColor(colorStr, shadowOpacity),
    }),
    ...(!isWeb &&
      (() => {
        // on native fix bug - shadows behave better if turned into non-alpha rgb() + shadowOpacity
        const rgba = colorToRGBA(colorStr)
        if (!rgba) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('No rgba form', colorStr)
          }
          return {
            shadowColor,
            shadowOpacity,
          }
        }
        const [r, g, b, a] = rgba
        return {
          shadowColor: `rgb(${r},${g},${b})`,
          shadowOpacity: shadowOpacity ?? a,
        }
      })()),
  }
}

const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderTopWidth: 'borderTopStyle',
  borderLeftWidth: 'borderLeftStyle',
  borderRightWidth: 'borderRightStyle',
}
