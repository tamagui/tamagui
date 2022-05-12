import { GetProps, getButtonSize, styled } from '@tamagui/core'

import { XStack } from './Stacks'

export const SizableStack = styled(XStack, {
  name: 'SizableStack',
  backgroundColor: '$background',
  flexDirection: 'row',
  flexShrink: 1,

  variants: {
    // allows the type to come in for use in size
    fontFamily: () => ({}),

    hoverable: {
      true: {
        hoverStyle: {
          backgroundColor: '$backgroundHover',
          borderColor: '$borderColorHover',
        },
      },
      false: {
        hoverStyle: {
          backgroundColor: '$background',
          borderColor: '$borderColor',
        },
      },
    },

    pressable: {
      true: {
        pressStyle: {
          backgroundColor: '$backgroundPress',
          borderColor: '$borderColorPress',
        },
      },
      false: {
        pressStyle: {
          backgroundColor: '$background',
          borderColor: '$borderColor',
        },
      },
    },

    focusable: {
      true: {
        focusStyle: {
          backgroundColor: '$backgroundFocus',
          borderColor: '$borderColorFocus',
        },
      },
    },

    bordered: {
      true: {
        borderWidth: 1,
        borderColor: '$borderColor',
      },
    },

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
        // this would be a breaking change...
        // hoverStyle: {
        //   backgroundColor: 'transparent',
        // },
      },
    },
  },
})

export type SizableStackProps = GetProps<typeof SizableStack>
