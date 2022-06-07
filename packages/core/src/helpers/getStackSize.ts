import { SizeTokens, VariantSpreadExtras } from '../types'
import { getSize, stepTokenUpOrDown } from './getSize'

export type ScaleVariantExtras = Pick<VariantSpreadExtras<any>, 'tokens' | 'props' | 'fonts'>

export const getButtonSize = (val: SizeTokens, { tokens }: VariantSpreadExtras<any>) => {
  const ySize = getSize(val, 0)
  const xSize = stepTokenUpOrDown(tokens.space, val)
  const radiusToken = tokens.radius[val] ?? tokens.radius['$4']
  return {
    paddingHorizontal: xSize,
    height: ySize,
    borderRadius: radiusToken,
  }
}
