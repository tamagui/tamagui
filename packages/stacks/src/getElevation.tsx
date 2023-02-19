import {
  SizeTokens,
  SizeVariantSpreadFunction,
  StackProps,
  VariantSpreadExtras,
  getVariableValue,
  isVariable,
} from '@tamagui/core'

export const getElevation: SizeVariantSpreadFunction<StackProps> = (size, extras) => {
  if (!size) return
  const { tokens } = extras
  const token = tokens.size[size]
  const sizeNum = (isVariable(token) ? +token.val : size) as number
  return getSizedElevation(sizeNum, extras)
}

export const getSizedElevation = (
  val: SizeTokens | number | boolean,
  { theme, tokens }: VariantSpreadExtras<any>
) => {
  let num = 0
  if (val === true) {
    const val = getVariableValue(tokens.size['true'])
    if (typeof val === 'number') {
      num = val
    } else {
      num = 10
    }
  } else {
    num = +val
  }
  if (process.env.NODE_ENV === 'development') {
    if (num !== null && isNaN(num)) {
      // eslint-disable-next-line no-console
      console.warn('NaN shadow', num, val)
    }
  }
  const [height, shadowRadius] = [Math.round(num / 4 + 1), Math.round(num / 2 + 2)]
  const shadow = {
    shadowColor: theme.shadowColor,
    shadowRadius,
    shadowOffset: { height, width: 0 },
  }
  return shadow
}
