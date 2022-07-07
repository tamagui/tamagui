import { SizeTokens, VariantSpreadExtras } from '../types'
import { getSize, stepTokenUpOrDown } from './getSize'

export type ScaleVariantExtras = Pick<VariantSpreadExtras<any>, 'tokens' | 'props' | 'fonts'>

export const getButtonSize = (val: SizeTokens | number, { tokens }: VariantSpreadExtras<any>) => {
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
