import { styled } from '@tamagui/core'
import { SizableStack, ThemeableStack } from '@tamagui/stacks'
import { getButtonSized } from '@tamagui/get-button-sized'

const TABS_NAME = 'Tabs'
export const DefaultTabsFrame = styled(SizableStack, {
  name: TABS_NAME,
})

const TRIGGER_NAME = 'TabsTrigger'

export const DefaultTabsTabFrame = styled(ThemeableStack, {
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

const CONTENT_NAME = 'TabsContent'

export const DefaultTabsContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,
})
