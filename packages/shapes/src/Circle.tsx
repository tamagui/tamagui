import { GetProps, styled } from '@tamagui/core'

import { Square } from './Square'

export const Circle = styled(Square, {
  name: 'Circle',
  circular: true,
})

export type CircleProps = GetProps<typeof Circle>
