import type { SizableTextProps } from './SizableText'

export type TextContextStyles = {
  color?: SizableTextProps['color']
  fontWeight?: SizableTextProps['fontWeight']
  fontSize?: SizableTextProps['fontSize']
  fontFamily?: SizableTextProps['fontFamily']
  fontStyle?: SizableTextProps['fontStyle']
  letterSpacing?: SizableTextProps['letterSpacing']
  textAlign?: SizableTextProps['textAlign']
  ellipsis?: SizableTextProps['ellipsis']
  maxFontSizeMultiplier?: number
}

export type TextParentStyles = TextContextStyles & {
  // all the other text controls
  textProps?: Partial<SizableTextProps>
  noTextWrap?: boolean
}
