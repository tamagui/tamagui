import type { SizeVariantSpreadFunction, VariantSpreadExtras } from '@tamagui/core'
import { getVariableValue, isWeb, resolveTokenSize } from '@tamagui/core'
import { getFontSized } from '@tamagui/get-font-sized'

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

const resolveInputFrame = (val: any, extras: VariantSpreadExtras<any>) =>
  resolveTokenSize(val, { tokens: extras.tokens, font: extras.font! }).frame

const inputSizeKeys = [
  '0',
  '0-25',
  '0-5',
  '0-75',
  '1',
  '1-5',
  '2',
  '2-5',
  '3',
  '3-5',
  '4',
  '4-5',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
] as const

const getInputPadding = (val: any, extras: VariantSpreadExtras<any>, steps: 1 | 2) => {
  if (typeof val === 'number') {
    return steps === 1
      ? Math.max(0, Math.round(val * 0.6 - 12))
      : Math.max(0, Math.round(val * 0.52 - 11.5))
  }
  const key = val === true ? '4' : val
  const index = inputSizeKeys.indexOf(key)
  return extras.tokens.space[inputSizeKeys[Math.max(0, index - steps)]]
}

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
  const frame = resolveInputFrame(val, extras)
  const fontStyle = getFontSized(val as any, extras)
  // lineHeight messes up input on native
  if (!isWeb && fontStyle) {
    delete fontStyle['lineHeight']
  }
  return {
    ...fontStyle,
    height: frame.size,
    borderRadius: frame.radius,
    paddingHorizontal: getInputPadding(val, extras, 1),
  }
}

export const textAreaSizeVariant: SizeVariantSpreadFunction<any> = (
  val = true,
  extras
) => {
  const { props } = extras
  const frame = resolveInputFrame(val, extras)
  const fontStyle = getFontSized(val as any, extras)!
  const lines = props.rows ?? props.numberOfLines
  const height =
    typeof lines === 'number' ? lines * getVariableValue(fontStyle.lineHeight) : 'auto'
  // lineHeight messes up input on native
  if (!isWeb && fontStyle) {
    delete fontStyle['lineHeight']
  }
  return {
    borderRadius: frame.radius,
    ...fontStyle,
    paddingVertical: getInputPadding(val, extras, 2),
    paddingHorizontal: getInputPadding(val, extras, 1),
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
  },
] as const
