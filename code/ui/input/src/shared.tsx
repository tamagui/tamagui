import { getVariableValue, isWeb, resolveSize, styled } from '@tamagui/core'
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

export const inputSizeVariant = styled.dynamic<any>((val = true, env) => {
  const { frame } = resolveSize(val, env)
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
    ...frame,
  }
})

export const textAreaSizeVariant = styled.dynamic<any>((val = true, env) => {
  return {
    ...inputSizeVariant(val, env),
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
