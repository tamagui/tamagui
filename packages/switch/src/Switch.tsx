import { SizeTokens, getVariableValue, styled } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import { ThemeableStack, YStack } from '@tamagui/stacks'

import { SwitchContext } from './SwitchContext'

export const SwitchThumb = styled(ThemeableStack, {
  name: 'SwitchThumb',
  context: SwitchContext,

  variants: {
    unstyled: {
      false: {
        size: '$true',
        backgroundColor: '$background',
        borderRadius: 1000,
      },
    },

    checked: {
      true: {},
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
    unstyled: false,
  },
})

const getSwitchHeight = (val: SizeTokens) =>
  Math.round(getVariableValue(getSize(val)) * 0.65)

const getSwitchWidth = (val: SizeTokens) => getSwitchHeight(val) * 2

export const SwitchFrame = styled(YStack, {
  name: 'Switch',
  context: SwitchContext,

  variants: {
    unstyled: {
      false: {
        size: '$true',
        borderRadius: 1000,
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '$background',

        focusStyle: {
          borderColor: '$borderColorFocus',
          outlineColor: '$borderColorFocus',
          outlineStyle: 'solid',
          outlineWidth: 1,
        },
      },
    },

    checked: {
      true: {},
    },

    frameWidth: {
      ':number': () => null,
    },

    size: {
      '...size': (val) => {
        const height = getSwitchHeight(val) + 4
        const width = getSwitchWidth(val) + 4
        return {
          height,
          minHeight: height,
          width,
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})
