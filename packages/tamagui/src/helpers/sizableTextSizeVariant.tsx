import {
  FontSizeTokens,
  SizeTokens,
  TextProps,
  VariantSpreadFunction,
  isVariable,
} from '@tamagui/core'

export const sizableTextSizeVariant: VariantSpreadFunction<
  TextProps,
  SizeTokens | FontSizeTokens
> = (val = '$4', { tokens, props }) => {
  const family = (
    typeof props.fontFamily === 'string'
      ? props.fontFamily
      : isVariable(props.fontFamily)
      ? props.fontFamily.val
      : props.fontFamily || '$body'
  ) as any
  const font = tokens.font[family] ?? tokens.font['$body']
  if (!font) {
    console.warn('⚠️ no font found', { family, fontTokens: Object.keys(tokens.font), val })
    return {}
  }
  const fontFamily = font.family
  const fontSize = props.fontSize || font.size[val]
  const lineHeight = props.lineHeight || font.lineHeight[val]
  const fontWeight = props.fontWeight || font.weight[val]
  const letterSpacing = props.letterSpacing || font.letterSpacing[val]
  return {
    fontFamily,
    fontWeight,
    letterSpacing,
    fontSize,
    lineHeight,
    // TODO fix this should be able to return token typs
  } as any
}
