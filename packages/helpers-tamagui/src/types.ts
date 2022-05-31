import { SizableTextProps } from '@tamagui/text'

export type TextParentStyles = {
  color?: SizableTextProps['color']
  fontWeight?: SizableTextProps['fontWeight']
  fontSize?: SizableTextProps['fontSize']
  fontFamily?: SizableTextProps['fontFamily']
  letterSpacing?: SizableTextProps['letterSpacing']
  textAlign?: SizableTextProps['textAlign']
  // all the other text controls
  textProps?: Partial<SizableTextProps>
  noTextWrap?: boolean
}
