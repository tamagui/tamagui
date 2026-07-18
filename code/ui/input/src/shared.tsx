import type { SizeVariantSpreadFunction } from '@tamagui/core'
import { Text } from '@tamagui/core'
import { getVariableValue, isWeb } from '@tamagui/core'
import { getButtonSized } from '@tamagui/get-button-sized'
import { getFontSized } from '@tamagui/get-font-sized'
import { getSize } from '@tamagui/get-token'

// Structural-only defaults for the unstyled Input behavior primitive.
// Theme decoration (palette, border, background, font family, hover/focus color
// styling) lives in the tamagui skin (code/ui/tamagui/src/components/Input.tsx),
// NOT here. Kept: the size mechanism (functional dimensions), the native outline
// reset, tab focusability, and the flex-overflow fix.
export const defaultStyles = {
  size: true,
  outlineWidth: 0,
  tabIndex: 0,

  // this fixes a flex bug where it overflows container
  minWidth: 0,
} as const

export const inputSizeVariant: SizeVariantSpreadFunction<any> = (val = true, extras) => {
  // Check for textarea mode via tag, rows, multiline, or numberOfLines
  if (
    extras.props.tag === 'textarea' ||
    extras.props.rows > 1 ||
    extras.props.multiline ||
    extras.props.numberOfLines > 1
  ) {
    return textAreaSizeVariant(val, extras)
  }
  const buttonStyles = getButtonSized(val, extras)
  const sizeVal = getVariableValue(getSize(val)) as number
  const paddingHorizontal = Math.max(0, Math.round(sizeVal * 0.6 - 12))
  const fontStyle = getFontSized(val as any, extras)
  // lineHeight messes up input on native
  if (!isWeb && fontStyle) {
    delete fontStyle['lineHeight']
  }
  return {
    ...fontStyle,
    ...buttonStyles,
    paddingHorizontal,
  }
}

export const textAreaSizeVariant: SizeVariantSpreadFunction<any> = (
  val = true,
  extras
) => {
  const { props } = extras
  const buttonStyles = getButtonSized(val, extras)
  const fontStyle = getFontSized(val as any, extras)!
  const lines = props.rows ?? props.numberOfLines
  const height =
    typeof lines === 'number' ? lines * getVariableValue(fontStyle.lineHeight) : 'auto'
  // lineHeight messes up input on native
  if (!isWeb && fontStyle) {
    delete fontStyle['lineHeight']
  }
  const sizeVal = getVariableValue(getSize(val)) as number
  const paddingVertical = Math.max(0, Math.round(sizeVal * 0.52 - 11.5))
  const paddingHorizontal = Math.max(0, Math.round(sizeVal * 0.6 - 12))
  return {
    ...buttonStyles,
    ...fontStyle,
    paddingVertical,
    paddingHorizontal,
    height,
  }
}
export const INPUT_NAME = 'Input'

export const styledBody = [
  {
    name: INPUT_NAME,
    render: 'input',
    ...defaultStyles,
    variants: {
      size: {
        true: inputSizeVariant,
        Size: inputSizeVariant,
      },

      disabled: {
        true: {},
      },
    } as const,
  },

  {
    isInput: true,
    accept: {
      placeholderTextColor: 'color',
      selectionColor: 'color',
      cursorColor: 'color',
      selectionHandleColor: 'color',
      underlineColorAndroid: 'color',
    } as const,

    validStyles: Text.staticConfig.validStyles,
  },
] as const
