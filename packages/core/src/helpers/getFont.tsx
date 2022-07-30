import { getVariableValue } from '../createVariable'
import { FontSizeTokens, TextProps, VariantSpreadFunction } from '../types'

export const getFont: VariantSpreadFunction<TextProps, FontSizeTokens> = (
  val = '$4',
  { fonts, theme, props }
) => {
  const family = getVariableValue(props.fontFamily) || '$body'
  const font = fonts[family] || fonts['$body']
  if (!font) {
    console.warn('⚠️ no font found', { family, fontTokens: Object.keys(fonts), val })
    return {} as any
  }
  const fontFamily = font.family
  const fontSize = props.fontSize || font.size[val]
  const lineHeight = props.lineHeight || font.lineHeight[val]
  const fontWeight = props.fontWeight || font.weight[val]
  const letterSpacing = props.letterSpacing || font.letterSpacing[val]
  const fontStyle = props.fontStyle || font.style?.[val]
  const textTransform = props.textTransform || font.transform?.[val]
  const color = props.color || font.color?.[val] || theme.color
  const style = {
    color,
    fontStyle,
    textTransform,
    fontFamily,
    fontWeight,
    letterSpacing,
    fontSize,
    lineHeight,
  }
  if (process.env.NODE_ENV === 'development') {
    if (props['debug']) {
      console.groupCollapsed('  🔹 getFont', val)
      console.log({ style, props, font })
      console.groupEnd()
    }
  }
  return style
}
