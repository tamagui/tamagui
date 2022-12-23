import { SizeVariantSpreadFunction } from '@tamagui/core'
import { SizableStackProps } from '@tamagui/stacks'

export const getShapeSize: SizeVariantSpreadFunction<SizableStackProps> = (
  size,
  { tokens },
) => {
  const width = tokens.size[size] ?? size
  const height = tokens.size[size] ?? size
  return {
    width,
    height,
    minWidth: width,
    maxWidth: width,
    maxHeight: height,
    minHeight: height,
  }
}
