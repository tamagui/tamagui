import { FontSizeTokens, TextProps, VariantSpreadFunction, getVariableValue } from '@tamagui/core'

export const sizableTextSizeVariant: VariantSpreadFunction<TextProps, FontSizeTokens> = (
  val = '$4',
  { tokens, props }
) => {
  const family = getVariableValue(props.fontFamily) || '$body'
  const font = tokens.font[family] || tokens.font['$body']
  if (!font) {
    console.warn('⚠️ no font found', { family, fontTokens: Object.keys(tokens.font), val })
    return {}
  }
  const fontFamily = font.family
  const fontSize = props.fontSize || font.size[val]
  const lineHeight = props.lineHeight || font.lineHeight[val]
  const fontWeight = props.fontWeight || font.weight[val]
  const letterSpacing = props.letterSpacing || font.letterSpacing[val]
  const fontStyle = props.fontStyle || font.style?.[val]
  const textTransform = props.textTransform || font.transform?.[val]
  return {
    fontStyle,
    textTransform,
    fontFamily,
    fontWeight,
    letterSpacing,
    fontSize,
    lineHeight,
  } as any
}
