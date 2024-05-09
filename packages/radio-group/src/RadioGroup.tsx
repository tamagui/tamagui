import { getVariableValue, styled } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import { ThemeableStack } from '@tamagui/stacks'

const RADIO_GROUP_ITEM_NAME = 'RadioGroupItem'

export const RadioGroupItemFrame = styled(ThemeableStack, {
  name: RADIO_GROUP_ITEM_NAME,
  tag: 'button',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        borderRadius: 1000,
        backgroundColor: '$background',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '$borderColor',
        padding: 0,

        hoverStyle: {
          borderColor: '$borderColorHover',
          backgroundColor: '$backgroundHover',
        },

        focusStyle: {
          borderColor: '$borderColorHover',
          backgroundColor: '$backgroundHover',
        },

        focusVisibleStyle: {
          outlineStyle: 'solid',
          outlineWidth: 2,
          outlineColor: '$outlineColor',
        },

        pressStyle: {
          borderColor: '$borderColorFocus',
          backgroundColor: '$backgroundFocus',
        },
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
        userSelect: 'none',
        cursor: 'not-allowed',

        hoverStyle: {
          borderColor: '$borderColor',
          backgroundColor: '$background',
        },

        pressStyle: {
          borderColor: '$borderColor',
          backgroundColor: '$backgroundColor',
        },

        focusVisibleStyle: {
          outlineWidth: 0,
        },
      },
    },

    size: {
      '...size': (value, { props }) => {
        const size = Math.floor(
          getVariableValue(getSize(value)) * (props['scaleSize'] ?? 0.5)
        )
        return {
          width: size,
          height: size,
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const RADIO_GROUP_INDICATOR_NAME = 'RadioGroupIndicator'

export const RadioGroupIndicatorFrame = styled(ThemeableStack, {
  name: RADIO_GROUP_INDICATOR_NAME,

  variants: {
    unstyled: {
      false: {
        width: '33%',
        height: '33%',
        borderRadius: 1000,
        backgroundColor: '$color',
        pressTheme: true,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const RADIO_GROUP_NAME = 'RadioGroup'

export const RadioGroupFrame = styled(ThemeableStack, {
  name: RADIO_GROUP_NAME,

  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',
        spaceDirection: 'horizontal',
      },
      vertical: {
        flexDirection: 'column',
        spaceDirection: 'vertical',
      },
    },
  } as const,
})
