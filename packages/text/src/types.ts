import { SizableTextProps } from './SizableText'

export type TextParentStyles = {
  color?: SizableTextProps['color']
  fontWeight?: SizableTextProps['fontWeight']
  fontSize?: SizableTextProps['fontSize']
  fontFamily?: SizableTextProps['fontFamily']
  fontStyle?: SizableTextProps['fontStyle']
  letterSpacing?: SizableTextProps['letterSpacing']
  textAlign?: SizableTextProps['textAlign']
  // all the other text controls
  textProps?: Partial<SizableTextProps>
  noTextWrap?: boolean
}
