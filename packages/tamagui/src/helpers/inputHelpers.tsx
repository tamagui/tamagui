import { SizeVariantSpreadFunction, getButtonSize, getTextSize, isWeb } from '@tamagui/core'

export const inputSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', extras) => {
  const buttonStyles = getButtonSize(val, extras)
  const font = getTextSize(val, extras)
  // lineHeight messes up input on native
  if (!isWeb && font) {
    delete font['lineHeight']
  }
  return {
    ...font,
    ...buttonStyles,
  }
}

export const textAreaSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', props) => {
  const fontStyle = getTextSize(val, props)
  // TODO fix any type
  const { height, ...inputStyle } = inputSizeVariant(val, props) as any
  return {
    ...fontStyle,
    ...inputStyle,
  }
}
