import {
  stylePropsTextOnly,
  type Shorthands,
  type TextStyle,
  type TextStylePropsBase,
  type WithShorthands,
} from '@tamagui/web'

import type { SizableTextProps } from './SizableText'

export const textParentProps = {
  ...stylePropsTextOnly,
  ellipsis: true,
  maxFontSizeMultiplier: true,
  noTextWrap: true,
  numberOfLines: true,
  textProps: true,
} as const

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

type TextParentStyleKeys = Extract<keyof TextStylePropsBase, keyof typeof textParentProps>

type TextParentStyleProps = Partial<Pick<TextStyle, TextParentStyleKeys>>
type TextParentShorthandKeys = {
  [Key in keyof Shorthands]: Shorthands[Key] extends TextParentStyleKeys ? Key : never
}[keyof Shorthands]

export type TextParentStyles = TextParentStyleProps &
  Pick<WithShorthands<TextParentStyleProps>, TextParentShorthandKeys> & {
    maxFontSizeMultiplier?: number
    textProps?: Partial<SizableTextProps>
    noTextWrap?: boolean
  }
