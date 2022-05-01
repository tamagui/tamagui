import { FontSizeTokens, TextProps, VariantSpreadFunction, getVariableValue } from '@tamagui/core'

export const sizableTextSizeVariant: VariantSpreadFunction<TextProps, FontSizeTokens> = (
  val = '$4',
  { fonts, theme, props }
) => {
  const family = getVariableValue(props.fontFamily) || '$body'
  const font = fonts[family] || fonts['$body']
  if (!font) {
    console.warn('⚠️ no font found', { family, fontTokens: Object.keys(fonts), val })
    return
  }
  const fontFamily = font.family
  const fontSize = props.fontSize || font.size[val]
  const lineHeight = props.lineHeight || font.lineHeight[val]
  const fontWeight = props.fontWeight || font.weight[val]
  const letterSpacing = props.letterSpacing || font.letterSpacing[val]
  const fontStyle = props.fontStyle || font.style?.[val]
  const textTransform = props.textTransform || font.transform?.[val]
  const color = props.color || font.color?.[val] || theme.color
  return {
    color,
    fontStyle,
    textTransform,
    fontFamily,
    fontWeight,
    letterSpacing,
    fontSize,
    lineHeight,
  } as any
}
