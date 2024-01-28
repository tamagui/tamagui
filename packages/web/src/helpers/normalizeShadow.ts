import { defaultOffset } from './defaultOffset'
import { getRgba, normalizeColor } from './normalizeColor'

export function normalizeShadow({
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
}: Record<string, any>) {
  const { height, width } = shadowOffset || defaultOffset
  return {
    shadowOffset: {
      width: width || 0,
      height: height || 0,
    },
    shadowRadius: shadowRadius || 0,
    shadowColor: normalizeColor(shadowColor, 1),
    shadowOpacity: shadowOpacity ?? (shadowColor ? getRgba(shadowColor)?.a : 1),
  }
}
