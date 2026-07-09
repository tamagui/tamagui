import { resolveDefaultSizeToken, styled, View, type SizeTokens } from '@tamagui/web'

const getSpacerSize = (size: SizeTokens | number | boolean, { tokens }) => {
  const sizeToken =
    typeof size === 'boolean' || typeof size === 'string'
      ? resolveDefaultSizeToken(size)
      : size
  const sizePx = tokens.space[sizeToken as any] ?? sizeToken
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
  render: 'span',

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
