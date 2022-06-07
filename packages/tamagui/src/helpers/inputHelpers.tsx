import { SizeVariantSpreadFunction, calc, getButtonSize, getTextSize, isWeb } from '@tamagui/core'

export const inputSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', extras) => {
  const buttonStyles = getButtonSize(val, extras)
  const fontStyle = getTextSize(val, extras)
  // lineHeight messes up input on native
  if (!isWeb && fontStyle) {
    delete fontStyle['lineHeight']
  }
  return {
    ...fontStyle,
    ...buttonStyles,
  }
}

export const textAreaSizeVariant: SizeVariantSpreadFunction<any> = (val = '$4', extras) => {
  const { props } = extras
  const buttonStyles = getButtonSize(val, extras)
  const fontStyle = getTextSize(val, extras)!
  const minHeight = calc(props.numberOfLines || 1, '*', fontStyle.lineHeight! as any)
  // TODO seems line lineHeight not being respected by react-native
  return {
    ...buttonStyles,
    ...fontStyle,
    minHeight,
  }
}
