import { styled, View, type SizeTokens } from '@tamagui/web'

const getSpacerSize = (size: SizeTokens | number | boolean, { tokens }) => {
  size = size === true ? '$true' : size
  const sizePx = tokens.space[size as any] ?? size
  return {
    width: sizePx,
    height: sizePx,
    minWidth: sizePx,
    minHeight: sizePx,
  }
}

export const Spacer = styled(View, {
  name: 'Spacer',
  pointerEvents: 'none',
  tag: 'span',

  variants: {
    size: {
      '...size': getSpacerSize,
      '...': getSpacerSize,
    },

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
