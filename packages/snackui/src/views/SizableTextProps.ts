import { Size } from './Size'
import { TextProps } from './Text'

export type SizableTextProps = TextProps & {
  size?: Size
  sizeLineHeight?: number
}
