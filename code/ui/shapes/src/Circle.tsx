import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { Square } from './Square'

export const Circle = styled(Square, {
  name: 'Circle',
  circular: true,
})

export type CircleProps = GetProps<typeof Circle>
