import { styled } from '@tamagui/core'
import { SizableStack, ThemeableStack } from '@tamagui/stacks'
import { getButtonSized } from '@tamagui/get-button-sized'

const TRIGGER_NAME = 'TabsTrigger'

export const TabsTriggerFrame = styled(ThemeableStack, {
  name: TRIGGER_NAME,
  tag: 'button',

  variants: {
    size: {
      '...size': getButtonSized,
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },

    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },

        focusStyle: {
          backgroundColor: '$background',
        },
      },
    },

    unstyled: {
      false: {
        borderWidth: 0,
        backgroundColor: '$background',
        userSelect: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        cursor: 'pointer',

        pressStyle: {
          backgroundColor: '$backgroundPress',
        },

        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },

        focusStyle: {
          backgroundColor: '$backgroundFocus',
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * TabsContent
 * -----------------------------------------------------------------------------------------------*/
const CONTENT_NAME = 'TabsContent'

export const TabsContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,
})

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

const TABS_NAME = 'Tabs'
export const TabsFrame = styled(SizableStack, {
  name: TABS_NAME,
})
