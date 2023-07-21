import { SizableStackProps } from '@tamagui/stacks'
import { SizeVariantSpreadFunction } from '@tamagui/web'

export const getShapeSize: SizeVariantSpreadFunction<SizableStackProps> = (
  size,
  { tokens, props }
) => {
  const width = props.width ?? tokens.size[size] ?? size
  const height = props.height ?? tokens.size[size] ?? size
  return {
    width,
    height,
    minWidth: width,
    maxWidth: width,
    maxHeight: height,
    minHeight: height,
  }
}
