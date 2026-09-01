import type { SizeTokens } from '@tamagui/core'
import {
  getVariableValue,
  isAndroid,
  isVariable,
  resolveSizeToken,
  styled,
} from '@tamagui/core'

export const getElevation = styled.dynamic<SizeTokens | number | boolean>((size, env) => {
  if (!size) return
  const { tokens } = env
  const sizeToken = resolveSizeToken(size, 'size')
  // elevation={10} means 10px, not size token '10'. the size scale is keyed by
  // numeric-looking strings, so only a non-numeric token may be looked up.
  if (typeof sizeToken === 'number') return getSizedElevation(sizeToken, env)
  const token = tokens.size[sizeToken]
  const sizeNum = (isVariable(token) ? +token.val : size) as number
  return getSizedElevation(sizeNum, env)
})

export const getSizedElevation = styled.dynamic<SizeTokens | number | boolean>(
  (val, { theme, tokens }) => {
    let num = 0
    if (typeof val === 'number') {
      num = val
    } else if (val) {
      const sizeToken = resolveSizeToken(val, 'size')
      const token = typeof sizeToken === 'number' ? sizeToken : tokens.size[sizeToken]
      const tokenValue = getVariableValue(token)
      if (typeof tokenValue === 'number') {
        num = tokenValue
      } else {
        num = 10
      }
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
