import { GetProps, Variable } from '@tamagui/core'
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
      '...size': (val = '4', { tokens, props }) => {
        const sizeIndex = Object.keys(tokens.size).indexOf(val)
        const size = tokens.size[sizeIndex] ?? tokens.size[val] ?? val
        const px = Math.round(+(size instanceof Variable ? size.val : size) * 0.7)
        const py = Math.round(+(size instanceof Variable ? size.val : size) * 0.5)
        console.log('wut', { props, val, sizeIndex, size, px, py, tokens })
        return {
          paddingHorizontal: px,
          paddingVertical: py,
          borderRadius: py * 0.75,
        }
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: 0.5,
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
