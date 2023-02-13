import { normalizeCSSColor } from '@tamagui/normalize-css-color'

import { defaultOffset } from './expandStyles'
import { rgba } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty.js'

export function normalizeShadow({
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
}: Record<string, any>) {
  const { height, width } = shadowOffset || defaultOffset
  const colorStr = String(shadowColor || 'black')
  // on native fix bug - shadows behave better if turned into non-alpha rgb() + shadowOpacity
  const val = normalizeCSSColor(colorStr)
  if (!val) {
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
