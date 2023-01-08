import type { SizeTokens, VariantSpreadExtras } from '@tamagui/core'
import { getSize, stepTokenUpOrDown } from '@tamagui/get-size'

export const getButtonSized = (
  val: SizeTokens | number,
  { tokens }: VariantSpreadExtras<any>
) => {
  if (typeof val === 'number') {
    return {
      paddingHorizontal: val * 0.25,
      height: val,
      borderRadius: val * 0.2,
    }
  }
  const ySize = getSize(val, 0)
  const xSize = stepTokenUpOrDown(tokens.space, val)
  const radiusToken = tokens.radius[val] ?? tokens.radius['$4']
  return {
    paddingHorizontal: xSize,
    height: ySize,
    borderRadius: radiusToken,
  }
}
