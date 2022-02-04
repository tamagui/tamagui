import { GetProps, Variable } from '@tamagui/core'
import { styled } from '@tamagui/core'

import { XStack } from './Stacks'

// for use in button-like things

export const createFrameSizeVariant =
  (sizeX = 0.8, sizeY = 0.33) =>
  (val = '4', { tokens, props }) => {
    const size = tokens.size[val] ?? val ?? 44
    const radius = tokens.radius[val] ?? size
    console.log('radius', radius)
    const px = Math.round(+(size instanceof Variable ? size.val : size) * sizeX)
    const py = Math.round(+(size instanceof Variable ? size.val : size) * sizeY)
    return {
      paddingHorizontal: px,
      paddingVertical: py,
      borderRadius: radius,
    }
  }

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

  variants: {
    size: {
      '...size': createFrameSizeVariant(),
    },

    circular: {
      true: (_, { props, tokens }) => {
        const size = tokens.size[props['size']] ?? tokens.size['$4'] ?? 44
        console.log('is circular')
        return {
          width: size,
          height: size,
          borderRadius: 100_000,
        }
      },
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
  },
})

export type InteractiveFrameProps = GetProps<typeof InteractiveFrame>
