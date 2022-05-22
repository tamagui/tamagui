import { GetProps, getButtonSize, styled } from '@tamagui/core'

import { YStack } from './Stacks'
import { bordered, circular, elevate, focusable, hoverable, pad, pressable } from './variants'

export const ThemeableSizableStack = styled(YStack, {
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

    size: {
      '...size': getButtonSize,
    },

    disabled: {
      true: {
        // pointerEvents: 'none',
        opacity: 0.45,
        backgroundColor: '$background',
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

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

export type ThemeableSizableStackProps = GetProps<typeof ThemeableSizableStack>
