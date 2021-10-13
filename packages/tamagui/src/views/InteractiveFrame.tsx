import { GetProps } from '@tamagui/core'
import { styled } from '@tamagui/core'

import { XStack } from './Stacks'

// for use in button-like things

export const InteractiveFrame = styled(XStack, {
  hitSlop: {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  },

  borderRadius: '$1',
  paddingVertical: '$2',
  paddingHorizontal: '$3',
  backgroundColor: '$bg2',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  flexShrink: 1,

  hoverStyle: {
    backgroundColor: '$bg3',
  },

  pressStyle: {
    backgroundColor: '$bg4',
  },

  variants: {
    size: {
      '...size': (val, { tokens }) => {
        const sizeIndex = Object.keys(tokens.size).indexOf(val)
        const oneSmaller = tokens.size[sizeIndex - 1] ?? tokens.size[val] ?? val
        return {
          paddingHorizontal: tokens.size[val] ?? val,
          paddingVertical: oneSmaller,
        }
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: 0.75,
        hoverStyle: {
          backgroundColor: '$bg',
        },
      },
    },
    active: {
      true: {
        backgroundColor: '$bg3',
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

export type InteractiveFrameProps = GetProps<typeof InteractiveFrame>
