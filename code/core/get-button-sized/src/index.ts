import { getSpace } from '@tamagui/get-token'
import {
  resolveDefaultSizeToken,
  type SizeTokens,
  type VariantSpreadExtras,
} from '@tamagui/web'

export const getButtonSized = (
  val: SizeTokens | number,
  { tokens, props }: VariantSpreadExtras<any>
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
  const sizeToken = resolveDefaultSizeToken(val)
  const xSize = getSpace(sizeToken)
  const radiusToken = tokens.radius[sizeToken] ?? sizeToken
  return {
    paddingHorizontal: xSize,
    height: sizeToken,
    borderRadius: props.circular ? 100_000 : radiusToken,
  }
}
