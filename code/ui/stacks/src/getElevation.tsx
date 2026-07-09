import type {
  SizeTokens,
  SizeVariantSpreadFunction,
  ViewProps,
  VariantSpreadExtras,
} from '@tamagui/core'
import {
  getVariableValue,
  isAndroid,
  isVariable,
  resolveDefaultSizeToken,
} from '@tamagui/core'

export const getElevation: SizeVariantSpreadFunction<ViewProps> = (size, extras) => {
  if (!size) return
  const { tokens } = extras
  const sizeToken = resolveDefaultSizeToken(size)
  const token = tokens.size[sizeToken]
  const sizeNum = (isVariable(token) ? +token.val : size) as number
  return getSizedElevation(sizeNum, extras)
}

export const getSizedElevation = (
  val: SizeTokens | number | boolean,
  { theme, tokens }: VariantSpreadExtras<any>
) => {
  let num = 0
  if (typeof val === 'number') {
    num = val
  } else if (val) {
    const token = tokens.size[resolveDefaultSizeToken(val)]
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
  const shadow = {
    shadowColor: theme.shadowColor,
    shadowRadius,
    shadowOffset: { height, width: 0 },
    ...(isAndroid
      ? {
          elevationAndroid: 2 * height,
        }
      : {}),
  }
  return shadow
}
