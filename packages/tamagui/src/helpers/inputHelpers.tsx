import {
  SizeVariantSpreadFunction,
  buttonScaling,
  createGetStackSize,
  getTextSize,
} from '@tamagui/core'

const inputSizeFrame = createGetStackSize({
  ...buttonScaling,
  sizeX: 0.4,
})

export const inputSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', props) => {
  const frame = inputSizeFrame(val, props)
  const font = getTextSize(val, props)
  return {
    ...font,
    ...frame,
    height: frame.minHeight,
  }
}

export const textAreaSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', props) => {
  const frame = inputSizeFrame(val, props)
  const font = getTextSize(val, props)
  return {
    ...font,
    ...frame,
  }
}
