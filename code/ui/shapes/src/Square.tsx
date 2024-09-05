import { ThemeableStack } from '@tamagui/stacks'
import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { getShapeSize } from './getShapeSize'

export const Square = styled(ThemeableStack, {
  name: 'Square',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    size: {
      '...size': getShapeSize,
      ':number': getShapeSize,
    },
  } as const,
})

export type SquareProps = GetProps<typeof Square>
