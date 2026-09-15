import { styled, View, type SpaceTokens } from '@tamagui/web'

const getSpacerSize = styled.dynamic<SpaceTokens | number | false>((size, env) => {
  if (size === false) return
  // a number is px. `true` is the default gap, else a space token key.
  const sizePx =
    typeof size === 'number'
      ? size
      : env.tokens.space[
          size === true ? '4' : String(size).replace(/^\$/, '')
        ]
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
