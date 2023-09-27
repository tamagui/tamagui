import { ThemeableStack } from '@tamagui/stacks'
import { GetProps, styled } from '@tamagui/web'

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
