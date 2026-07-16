import { resolveDefaultToken, styled, View, type SizeTokens } from '@tamagui/web'

const getSpacerSize = (size: SizeTokens | number | boolean, { tokens }) => {
  const sizeToken = typeof size === 'boolean' ? resolveDefaultToken(size, 'space') : size
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
      true: getSpacerSize,
      Size: getSpacerSize,
      any: getSpacerSize,
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
