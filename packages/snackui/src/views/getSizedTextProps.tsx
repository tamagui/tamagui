import { TextStyle } from 'react-native'

import { SizableTextProps, getSize } from './Size'

// experiment doing smaller for touch, but fails with static extration..
// const isSmallDevice = isNative || (supportsTouchWeb && defaultSmall)
// const scale = isSmallDevice ? 0.9 : 1

export const getSizedTextProps = ({
  size = 1,
  sizeLineHeight = 1,
}: SizableTextProps): TextStyle => {
  const sizeAmt = getSize(size)
  // get a little less spaced as we go higher
  const lineHeightScaleWithSize = -(2 - sizeAmt) * 0.6
  const lineHeight = Math.round(
    (26 + lineHeightScaleWithSize) * sizeAmt * sizeLineHeight
  )
  return {
    fontSize: Math.round(16 * sizeAmt),
    lineHeight,
    marginVertical: -lineHeight * 0.08,
  }
}
