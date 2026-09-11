import { resolveSize } from '@tamagui/size'
import { styled, View, type SizeTokens } from '@tamagui/web'

const getSpacerSize = styled.dynamic<SizeTokens | number | boolean>((size, env) => {
  if (size === false) return
  const sizePx =
    typeof size === 'number' ? size : resolveSize(size, env).frame.paddingHorizontal
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
