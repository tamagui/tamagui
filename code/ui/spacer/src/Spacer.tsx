import { resolveSize } from '@tamagui/size'
import { styled, View, type SizeTokens } from '@tamagui/web'

const getSpacerSize = styled.dynamic<SizeTokens | number | boolean>((size, env) => {
  if (size === false) return
  // a space token first, the same order getShapeSize reads. a spacer is a gap,
  // not a control, so `size="$5"` here means the 5 step on the space scale; it
  // must not step onto the named control ramp the way a Button's size does.
  const key = typeof size === 'string' ? size.replace(/^\$/, '') : undefined
  const sizePx =
    typeof size === 'number'
      ? size
      : ((key && env.tokens.space[key as keyof typeof env.tokens.space]) ??
        resolveSize(size, env).frame.paddingHorizontal)
  return {
    width: sizePx,
    height: sizePx,
    minWidth: sizePx,
    minHeight: sizePx,
  }
})

export const Spacer = styled(View, {
  displayName: 'Spacer',
  pointerEvents: 'none',
  render: 'span',

  variants: {
    size: getSpacerSize,

    direction: {
      horizontal: {
        height: 0,
        minHeight: 0,
      },
      vertical: {
        width: 0,
        minWidth: 0,
      },
      both: {},
    },
  } as const,

  defaultVariants: {
    // @ts-ignore
    size: true,
  },
})
