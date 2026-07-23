import { getRadius, getSpace } from '@tamagui/get-token'
import {
  resolveDefaultToken,
  type SizeTokens,
  type VariantSpreadExtras,
} from '@tamagui/web'

export const getButtonSized = (
  val: SizeTokens | number | true,
  { props }: VariantSpreadExtras<any>
) => {
  if (!val || props.circular) {
    return
  }
  if (typeof val === 'number') {
    return {
      paddingHorizontal: val * 0.25,
      height: val,
      borderRadius: props.circular ? 100_000 : val * 0.2,
    }
  }
  const sizeToken = resolveDefaultToken(val, 'size')
  const xSize = getSpace(val)
  const radiusToken = getRadius(val)
  return {
    paddingHorizontal: xSize,
    height: sizeToken,
    borderRadius: props.circular ? 100_000 : radiusToken,
  }
}
