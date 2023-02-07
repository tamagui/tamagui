import { defaultOffset } from './expandStyles'
import { normalizeValueWithProperty } from './normalizeValueWithProperty.js'

export function normalizeShadow({
  shadowColor,
  shadowOffset,
  shadowOpacity = 1,
  shadowRadius,
}: Record<string, any>) {
  const { height, width } = shadowOffset || defaultOffset
  return {
    shadowOffset: {
      width: normalizeValueWithProperty(width || 0),
      height: normalizeValueWithProperty(height || 0),
    },
    shadowRadius: normalizeValueWithProperty(shadowRadius || 0),
    shadowColor,
    shadowOpacity,
  }
}
