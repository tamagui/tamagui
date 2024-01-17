import { defaultOffset } from './defaultOffset'
import { normalizeColor, rgba } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'

export function normalizeShadow({
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
}: Record<string, any>) {
  const { height, width } = shadowOffset || defaultOffset
  return {
    shadowOffset: {
      width: normalizeValueWithProperty(width || 0),
      height: normalizeValueWithProperty(height || 0),
    },
    shadowRadius: normalizeValueWithProperty(shadowRadius || 0),
    shadowColor: normalizeColor(shadowColor, 1),
    shadowOpacity: shadowOpacity ?? rgba(shadowColor).a,
  }
}
