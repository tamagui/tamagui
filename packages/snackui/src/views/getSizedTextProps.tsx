import { SizableTextProps, getSize } from './Size'

export const getSizedTextProps = ({
  size = 1,
  sizeLineHeight = 1,
  ...rest
}: SizableTextProps): any => {
  const sizeAmt = getSize(size)
  // get a little less spaced as we go higher
  const lineHeightScaleWithSize = -(2 - sizeAmt) * 0.55
  const lineHeight = Math.round((26 + lineHeightScaleWithSize) * sizeAmt * sizeLineHeight)
  return {
    fontSize: Math.round(16 * sizeAmt),
    lineHeight,
    marginVertical: -lineHeight * 0.08,
    ...rest,
  }
}
