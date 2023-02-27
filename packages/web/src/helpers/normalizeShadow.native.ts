import { normalizeCSSColor } from '@tamagui/normalize-css-color'

import { defaultOffset } from './defaultOffset.js'
import { rgba } from './normalizeColor.js'
import { normalizeValueWithProperty } from './normalizeValueWithProperty.js'

export function normalizeShadow({
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
}: Record<string, any>) {
  const { height, width } = shadowOffset || defaultOffset
  const colorStr = String(shadowColor || 'black')
  const val = normalizeCSSColor(colorStr)
  if (typeof val !== 'number') {
    throw new Error(`invalid shadow color ${colorStr}`)
  }
  const { r, g, b, a } = rgba(val)
  return {
    shadowOffset: {
      width: normalizeValueWithProperty(width || 0),
      height: normalizeValueWithProperty(height || 0),
    },
    shadowRadius: normalizeValueWithProperty(shadowRadius || 0),
    shadowColor: `rgb(${r},${g},${b})`,
    shadowOpacity: shadowOpacity ?? a,
  }
}
