import { getVariableValue, resolveTextMetrics } from '@tamagui/core'

// Structural-only defaults for the unstyled Input behavior primitive.
// Sizing (padding, font, radius) lives in the tamagui skin
// (code/ui/tamagui/src/components/Input.tsx), which owns a size table per
// size. Theme decoration (palette, border, background, font family, hover/focus
// color styling) lives there too, NOT here. Kept: the native outline reset,
// tab focusability, and the flex-overflow fix.
export const defaultStyles = {
  outlineWidth: 0,
  tabIndex: 0,

  // this fixes a flex bug where it overflows container
  minWidth: 0,
} as const

// Textarea height from `rows`: lines times the font's line height for the
// explicit fontSize/lineHeight when given, else the font's default size.
export const resolveTextAreaSize = (
  props: Record<string, any>,
  env: {
    font?: { size: Record<string, any>; lineHeight?: Record<string, any> }
    fonts: Record<string, { size: Record<string, any>; lineHeight?: Record<string, any> }>
  }
) => {
  const font = props.fontFamily ? env.fonts[props.fontFamily] : env.font
  const defaultKey = font && 'sm' in font.size ? 'sm' : '4'
  const fontSize = props.fontSize ?? defaultKey
  const lineHeight = props.lineHeight ?? font?.lineHeight?.[defaultKey]
  const configuredSize = typeof fontSize === 'string' ? font?.size[fontSize] : undefined
  const configuredLeading =
    typeof lineHeight === 'string' ? font?.lineHeight?.[lineHeight] : undefined
  const metrics: Record<string, unknown> = {
    fontSize: Number.parseFloat(String(getVariableValue(configuredSize ?? fontSize))),
  }
  const leading = configuredLeading ?? lineHeight
  resolveTextMetrics(
    metrics,
    (props.lineHeight == null || configuredLeading !== undefined) &&
      typeof leading === 'number'
      ? `${leading}px`
      : leading
  )
  const lines = props.rows ?? props.numberOfLines
  const height =
    typeof lines === 'number' && typeof metrics.lineHeight === 'number'
      ? lines * metrics.lineHeight
      : undefined
  return {
    height,
  }
}

export const resolveMultilineInputSize = (
  props: Record<string, any>,
  env: Parameters<typeof resolveTextAreaSize>[1]
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
      disabled: {
        true: {},
      },
    } as const,
  },

  {
    isInput: true,
  },
] as const
