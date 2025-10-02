import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { Square } from './Square'

export const Circle = styled(Square, {
  name: 'Circle',
  borderRadius: 100_000_000,
})

export type CircleProps = GetProps<typeof Circle>
