import { TextProps } from 'snackui/src/views/Text'
import { getSize, SizableTextProps } from './Size'

// doing this in a lengthy manner because we need to preserve order

export const getSizedTextProps = (props: SizableTextProps, defaults: SizableTextProps): any => {
  const sizeAmt = getSize(props.size ?? 1)
  const next: TextProps = {}
  for (const key in defaults) {
    if (!(key in props)) {
      next[key] = defaults[key]
    }
  }
  // preserving order is important!
  for (const key in props) {
    if (key === 'size') {
      next.fontSize = Math.round(16 * sizeAmt)
      continue
    }
    if (key === 'sizeLineHeight') {
      const lineHeightScaleWithSize = -(2 - sizeAmt) * 0.55
      next.lineHeight = Math.round((26 + lineHeightScaleWithSize) * sizeAmt * (props.sizeLineHeight ?? 1))
      next.marginVertical = -next.lineHeight * 0.08
      continue
    }
    next[key] = props[key]
  }
  return next
}
