import { GetProps, styled } from '@tamagui/core'
import { ThemeableStack } from '@tamagui/stacks'

import { getShapeSize } from './getShapeSize'

export const Square = styled(ThemeableStack, {
  name: 'Square',
  alignItems: 'center',
  justifyContent: 'center',
  backgrounded: true,

  variants: {
    circular: {
      true: {
        borderRadius: 100_000,
      },
    },

    size: {
      '...size': getShapeSize,
    },
  },
})

export type SquareProps = GetProps<typeof Square>
