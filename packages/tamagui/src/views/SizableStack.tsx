import { GetProps, styled } from '@tamagui/core'

import { getSize } from '../helpers/getSize'
import { XStack } from './Stacks'

export const getButtonSize = getSize()

export const SizableStack = styled(XStack, {
  name: 'SizableStack',
  backgroundColor: '$background',
  flexDirection: 'row',
  flexShrink: 1,

  variants: {
    hoverable: {
      true: {
        hoverStyle: {
          backgroundColor: '$backgroundHover',
          borderColor: '$borderColorHover',
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
      '...size': (val, extras) => getButtonSize(val, extras),
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
