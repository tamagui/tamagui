import { GetProps, getButtonSize, styled } from '@tamagui/core'

import { YStack } from './Stacks'
import { focusable, hoverable, pressable } from './variants'

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
    size: {
      '...size': getButtonSize,
    },

    bordered: {
      true: {
        borderWidth: 1,
        borderColor: '$borderColor',
      },
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
        // this would be a breaking change...
        // hoverStyle: {
        //   backgroundColor: 'transparent',
        // },
      },
    },
  },
})

export type ThemeableSizableStackProps = GetProps<typeof ThemeableSizableStack>
