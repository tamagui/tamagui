import { YStack } from '@tamagui/stacks'
import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { getShapeSize } from './getShapeSize'

export const Square = styled(YStack, {
  name: 'Square',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    size: {
      '...size': getShapeSize,
      ':number': getShapeSize,
    },

    circular: {
      true: {
        borderRadius: 100_000,
      },
    },
  } as const,
})

export type SquareProps = GetProps<typeof Square>
