import { getVariableValue, isWeb, resolveTokenSize, styled } from '@tamagui/core'
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

const resolveInputFrame = (val: any, env: Parameters<typeof getFontSized>[1]) =>
  resolveTokenSize(val, { tokens: env.tokens, font: env.font! }).frame

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

const getInputPadding = (
  val: any,
  env: Parameters<typeof getFontSized>[1],
  steps: 1 | 2
) => {
  if (typeof val === 'number') {
    return steps === 1
      ? Math.max(0, Math.round(val * 0.6 - 12))
      : Math.max(0, Math.round(val * 0.52 - 11.5))
  }
  const key = val === true ? '4' : val
  const index = inputSizeKeys.indexOf(key)
  return env.tokens.space[inputSizeKeys[Math.max(0, index - steps)]]
}

export const inputSizeVariant = styled.dynamic<any>((val = true, env) => {
  const frame = resolveInputFrame(val, env)
  const fontStyle = getFontSized(val as any, env)
  return {
    color: fontStyle?.color,
    fontFamily: fontStyle?.fontFamily,
    fontSize: fontStyle?.fontSize,
    fontStyle: fontStyle?.fontStyle,
    fontWeight: fontStyle?.fontWeight,
    letterSpacing: fontStyle?.letterSpacing,
    lineHeight: isWeb ? fontStyle?.lineHeight : undefined,
    textTransform: fontStyle?.textTransform,
    height: frame.size,
    borderRadius: frame.radius,
    paddingHorizontal: getInputPadding(val, env, 1),
  }
})

export const textAreaSizeVariant = styled.dynamic<any>((val = true, env) => {
  const frame = resolveInputFrame(val, env)
  const fontStyle = getFontSized(val as any, env)
  return {
    borderRadius: frame.radius,
    color: fontStyle?.color,
    fontFamily: fontStyle?.fontFamily,
    fontSize: fontStyle?.fontSize,
    fontStyle: fontStyle?.fontStyle,
    fontWeight: fontStyle?.fontWeight,
    letterSpacing: fontStyle?.letterSpacing,
    lineHeight: isWeb ? fontStyle?.lineHeight : undefined,
    textTransform: fontStyle?.textTransform,
    paddingVertical: getInputPadding(val, env, 2),
    paddingHorizontal: getInputPadding(val, env, 1),
    height: 'auto',
  }
})

export const resolveTextAreaSize = (
  props: Record<string, any>,
  env: Parameters<typeof textAreaSizeVariant>[1]
) => {
  const sized = textAreaSizeVariant(props.size ?? true, env)
  const fontStyle = getFontSized(props.size ?? true, env)
  const lines = props.rows ?? props.numberOfLines
  const height =
    typeof lines === 'number'
      ? lines * getVariableValue(fontStyle?.lineHeight)
      : sized?.height
  return {
    borderRadius: sized?.borderRadius,
    color: sized?.color,
    fontFamily: sized?.fontFamily,
    fontSize: sized?.fontSize,
    fontStyle: sized?.fontStyle,
    fontWeight: sized?.fontWeight,
    letterSpacing: sized?.letterSpacing,
    lineHeight: sized?.lineHeight,
    textTransform: sized?.textTransform,
    paddingVertical: sized?.paddingVertical,
    paddingHorizontal: sized?.paddingHorizontal,
    height,
  }
}

export const resolveMultilineInputSize = (
  props: Record<string, any>,
  env: Parameters<typeof textAreaSizeVariant>[1]
) => {
  if (!(props.rows > 1 || props.multiline || props.numberOfLines > 1)) return
  return resolveTextAreaSize(props, env)
}
export const INPUT_NAME = 'Input'

export const styledBody = [
  {
    name: INPUT_NAME,
    render: 'input',
    ...defaultStyles,
    variants: {
      size: inputSizeVariant,

      disabled: {
        true: {},
      },
    } as const,
  },

  {
    isInput: true,
  },
] as const
