import type { SizeTokens } from '@tamagui/core'
import { getVariableValue, styled } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import { YStack } from '@tamagui/stacks'

export const SwitchThumb = styled(
  YStack,
  {
    name: 'SwitchThumb',

    variants: {
      unstyled: {
        false: {
          size: '$true',
          backgroundColor: '$color',
          borderRadius: 1000,
        },
      },

      size: {
        '...size': (val) => {
          const size = getSwitchHeight(val)
          return {
            height: size,
            width: size,
          }
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1',
    },
  },
  {
    accept: {
      activeStyle: 'style',
    } as const,
  }
)

const getSwitchHeight = (val: SizeTokens) =>
  Math.round(getVariableValue(getSize(val)) * 0.65)

const getSwitchWidth = (val: SizeTokens) => getSwitchHeight(val) * 2

export const SwitchFrame = styled(
  YStack,
  {
    name: 'Switch',
    render: 'button',
    tabIndex: 0,

    variants: {
      unstyled: {
        false: {
          borderRadius: 1000,
          backgroundColor: '$background',

          focusVisibleStyle: {
            outlineColor: '$outlineColor',
            outlineStyle: 'solid',
            outlineWidth: 2,
          },
        },
      },

      size: {
        '...size': (val, { props }) => {
          if (props['unstyled']) return
          const height = getSwitchHeight(val)
          const width = getSwitchWidth(val)
          return {
            height,
            minHeight: height,
            width,
          }
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1',
    },
  },
  {
    accept: {
      activeStyle: 'style',
    } as const,
  }
)
