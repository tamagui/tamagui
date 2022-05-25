import { GetProps, styled } from '@tamagui/core'

import { YStack } from './Stacks'
import { bordered, circular, elevate, focusable, hoverable, pad, pressable } from './variants'

export const ThemeableStack = styled(YStack, {
  name: 'SizableStack',
  backgroundColor: '$background',
  flexDirection: 'row',
  flexShrink: 1,

  variants: {
    // allows the type to come in for use in size
    fontFamily: () => ({}),

    hoverable,
    pressable,
    focusable,
    circular,
    pad,
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

const Test = styled(ThemeableStack, {
  variants: {
    something: {
      true: {},
    },
  },
})

type T = GetProps<typeof Test>
type x = T['chromeless']
