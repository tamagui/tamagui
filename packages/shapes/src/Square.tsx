import { GetProps, styled } from '@tamagui/core'
import { SizableStack } from '@tamagui/stacks'

import { getShapeSize } from './getShapeSize'

export const Square = styled(SizableStack, {
  name: 'Square',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  variants: {
    size: {
      '...size': getShapeSize,
    },
  },
})

export type SquareProps = GetProps<typeof Square>
