import { GetProps, styled } from '@tamagui/core'

import { SizableStack } from './SizableStack'
import { getSquareSize } from './Square'

export const Circle = styled(SizableStack, {
  name: 'Circle',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 100_000_000,
  overflow: 'hidden',

  variants: {
    size: {
      '...size': getSquareSize,
    },
  },
})

export type CircleProps = GetProps<typeof Circle>

// test types
// const a = <Circle size={100} />
// const b = <Circle size="sm" />
// const c = <Circle size="nope" />
