import {
  SizeVariantSpreadFunction,
  buttonScaling,
  createGetStackSize,
  getTextSize,
  isWeb,
} from '@tamagui/core'

const inputSizeFrame = createGetStackSize({
  ...buttonScaling,
  sizeX: 0.6,
})

export const inputSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', props) => {
  const frame = inputSizeFrame(val, props)
  const font = getTextSize(val, props)
  // lineHeight messes up input on native
  if (!isWeb && font) {
    delete font['lineHeight']
  }
  return {
    ...font,
    ...frame,
    paddingVertical: 0,
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
