import type { GetProps } from '@tamagui/core'
import { styled } from '@tamagui/core'
import { getButtonSized } from '@tamagui/get-button-sized'

import { XStack } from './Stacks'
import {
  bordered,
  circular,
  elevate,
  focusTheme,
  hoverTheme,
  pressTheme,
} from './variants'

export const SizableStack = styled(XStack, {
  name: 'SizableStack',

  variants: {
    unstyled: {
      true: {
        hoverTheme: false,
        pressTheme: false,
        focusTheme: false,
        elevate: false,
        bordered: false,
      },
    },

    hoverTheme,
    pressTheme,
    focusTheme,
    circular,
    elevate,
    bordered,

    size: {
      '...size': (val, extras) => {
        return getButtonSized(val, extras)
      },
    },
  } as const,
})

export type SizableStackProps = GetProps<typeof SizableStack>
