import { SizeVariantSpreadFunction, getButtonSize, getTextSize } from '@tamagui/core'

const inputSizeFrame = getButtonSize(0.75, 0.75)

export const inputSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', props) => {
  const frame = inputSizeFrame(val, props)
  const font = getTextSize(val, props)
  return {
    ...frame,
    ...font,
    minHeight: 'auto',
  }
}
