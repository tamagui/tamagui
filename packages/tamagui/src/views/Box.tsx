import { GetProps, styled } from '@tamagui/core'

import { YStack } from './Stacks'

export const Box = styled(YStack, {
  backgroundColor: '$bg2',
  elevation: '$1',
})

export type BoxProps = GetProps<typeof Box>
