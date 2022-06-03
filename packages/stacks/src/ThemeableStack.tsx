import { GetProps, styled } from '@tamagui/core'

import { YStack } from './Stacks'
import {
  bordered,
  circular,
  elevate,
  focusable,
  hoverable,
  padded,
  pressable,
  radiused,
} from './variants'

export const ThemeableStack = styled(YStack, {
  name: 'SizableStack',

  variants: {
    // allows the type to come in for use in size
    fontFamily: () => ({}),

    backgrounded: {
      true: {
        backgroundColor: '$background',
      },
    },

    radiused,
    hoverable,
    pressable,
    focusable,
    circular,
    padded,
    elevate,
    bordered,

    transparent: {
      true: {
        backgroundColor: 'transparent',
      },
    },

    chromeless: {
      true: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        shadowColor: 'transparent',
      },
    },
  },
})

export type ThemeableStackProps = GetProps<typeof ThemeableStack>
