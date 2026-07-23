import type { YStackProps } from '@tamagui/stacks'
import type { SizeVariantSpreadFunction } from '@tamagui/web'
import { resolveDefaultSizeToken } from '@tamagui/web'

export const getShapeSize: SizeVariantSpreadFunction<YStackProps> = (
  size,
  { tokens }
) => {
  const sizeToken = resolveDefaultSizeToken(size)
  const width = tokens.size[sizeToken] ?? sizeToken
  const height = tokens.size[sizeToken] ?? sizeToken
  return {
    width,
    height,
    minWidth: width,
    maxWidth: width,
    maxHeight: height,
    minHeight: height,
  }
}
