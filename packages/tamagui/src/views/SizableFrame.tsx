import { GetProps, Variable, VariantSpreadExtras, isVariable } from '@tamagui/core'
import { styled } from '@tamagui/core'

import { XStack } from './Stacks'

// for use in button-like things

export const getSize =
  (sizeX = 0.8, sizeY = 0.333) =>
  (val: any, { tokens }: VariantSpreadExtras<any>) => {
    const size = tokens.size[val] ?? tokens.size['$4'] ?? val ?? 14
    const radius = tokens.radius[val] ?? tokens.radius['$4'] ?? size
    const px = Math.round(+(isVariable(size) ? size.val : size) * sizeX)
    const py = Math.round(+(isVariable(size) ? size.val : size) * sizeY)
    return {
      paddingHorizontal: px,
      paddingVertical: py,
      borderRadius: radius,
    }
  }

export const getButtonSize = getSize()

export const SizableFrame = styled(XStack, {
  borderRadius: '$1',
  paddingVertical: '$2',
  paddingHorizontal: '$3',
  backgroundColor: '$background',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  flexShrink: 1,

  variants: {
    hoverable: {
      true: {
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
      },
    },

    pressable: {
      true: {
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
      },
    },

    focusable: {
      true: {
        focusStyle: {
          backgroundColor: '$backgroundFocus',
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

export type SizableFrameProps = GetProps<typeof SizableFrame>
