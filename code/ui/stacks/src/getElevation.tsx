import type { SizeTokens } from '@tamagui/core'
import { isAndroid, resolveSize, styled } from '@tamagui/core'

export const getElevation = styled.dynamic<SizeTokens | number | boolean>((size, env) => {
  if (!size) return
  // elevation={10} means 10px, not size token '10'. the size scale is keyed by
  // numeric-looking strings, so only a non-numeric token may be looked up.
  if (typeof size === 'number') return getSizedElevation(size, env)
  return getSizedElevation(resolveSize(size, env).controlHeight, env)
})

export const getSizedElevation = styled.dynamic<SizeTokens | number | boolean>(
  (val, env) => {
    const { theme } = env
    let num = 0
    if (typeof val === 'number') {
      num = val
    } else if (val) {
      num = resolveSize(val, env).controlHeight || 10
    }
    if (num === 0) {
      return
    }
    const [height, shadowRadius] = [Math.round(num / 4 + 1), Math.round(num / 2 + 2)]
    const shadowColor = (theme as any)['shadow-color'] ?? (theme as any).shadowColor
    return {
      shadowColor,
      shadowRadius,
      shadowOffset: { height, width: 0 },
      elevationAndroid: isAndroid ? 2 * height : undefined,
    }
  }
)
