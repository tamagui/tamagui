import { GetProps, Variable } from '@tamagui/core'
import { styled } from '@tamagui/core'

import { XStack } from './Stacks'

// for use in button-like things

export const createFrameSizeVariant =
  (sizeX = 0.8, sizeY = 0.33) =>
  (val = '4', { tokens, props }) => {
    const sizeIndex = Object.keys(tokens.size).indexOf(val)
    const size = tokens.size[sizeIndex] ?? tokens.size[val] ?? val
    const radius = tokens.radius[val] ?? tokens.radius[sizeIndex] ?? size
    const px = Math.round(+(size instanceof Variable ? size.val : size) * sizeX)
    const py = Math.round(+(size instanceof Variable ? size.val : size) * sizeY)
    return {
      paddingHorizontal: px,
      paddingVertical: py,
      borderRadius: radius,
    }
  }

export const interactiveFrameVariants = {
  size: {
    '...size': createFrameSizeVariant(),
  },

  disabled: {
    true: {
      // pointerEvents: 'none',
      opacity: 0.45,
      backgroundColor: '$bg',
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
} as const

export const InteractiveFrame = styled(XStack, {
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

  variants: interactiveFrameVariants,
})

export type InteractiveFrameProps = GetProps<typeof InteractiveFrame>
