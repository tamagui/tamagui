import { getSpace } from '@tamagui/get-token'
import type { SizeTokens, VariantSpreadExtras } from '@tamagui/web'

export const getButtonSized = (
  val: SizeTokens | number,
  { tokens }: VariantSpreadExtras<{}>
) => {
  if (typeof val === 'number') {
    return {
      paddingHorizontal: val * 0.25,
      height: val,
      borderRadius: val * 0.2,
    }
  }
  const xSize = getSpace(val)
  const radiusToken = tokens.radius[val] ?? tokens.radius['$true']
  return {
    paddingHorizontal: xSize,
    height: val,
    borderRadius: radiusToken,
  }
}
