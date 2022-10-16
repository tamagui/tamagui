import { GetProps, styled } from '@tamagui/core'
import { getButtonSized } from '@tamagui/get-button-sized'

import { YStack } from './Stacks'
import { bordered, circular, elevate, focusTheme, hoverTheme, pressTheme } from './variants'

export const SizableStack = styled(YStack, {
  name: 'SizableStack',
  backgroundColor: '$background',
  flexDirection: 'row',
  flexShrink: 1,

  variants: {
    // allows the type to come in for use in size
    fontFamily: () => ({}),

    hoverTheme,
    pressTheme,
    focusTheme,
    circular,
    elevate,
    bordered,

    size: {
      '...size': getButtonSized,
    },
  } as const,
})

export type SizableStackProps = GetProps<typeof SizableStack>
