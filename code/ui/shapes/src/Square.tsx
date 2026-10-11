import { YStack } from '@tamagui/stacks'
import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { getShapeSize } from './getShapeSize'

export const Square = styled(
  YStack,
  {
    displayName: 'Square',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
      size: getShapeSize,

      // shape modifiers formerly inherited from ThemeableStack (now removed).
      circular: {
        true: {
          borderRadius: 100_000,
        },
      },

      transparent: {
        true: {
          backgroundColor: 'transparent',
        },
      },
    } as const,
  },
  {
    memo: true,
  }
)

export type SquareProps = GetProps<typeof Square>
