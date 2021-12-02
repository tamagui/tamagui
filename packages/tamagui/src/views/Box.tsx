import { GetProps, styled } from '@tamagui/core'

import { YStack } from './Stacks'

export const Box = styled(YStack, {
  backgroundColor: '$bg2',
  borderRadius: '$2',
  elevation: '$3',
})

export type BoxProps = GetProps<typeof Box>
