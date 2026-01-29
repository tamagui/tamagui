import { defaultOffset } from './defaultOffset'

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
    // pass color through as-is, opacity applied via color-mix in getCSSStylesAtomic
    shadowColor: shadowColor,
    // default to 1 if not specified (color-mix will handle the opacity)
    shadowOpacity: shadowOpacity ?? 1,
  }
}
