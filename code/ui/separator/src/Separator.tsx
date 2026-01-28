import { isWeb } from '@tamagui/constants'
import { View, styled } from '@tamagui/core'

export const Separator = styled(View, {
  name: 'Separator',

  variants: {
    unstyled: {
      false: {
        borderColor: '$backgroundFocus',
        flexShrink: 0,
        borderWidth: 0,
        flex: 1,
        height: 0,
        maxHeight: 0,
        borderBottomWidth: 1,
        y: -0.5,
      },
    },

    vertical: {
      true: {
        y: 0,
        x: -0.5,
        height: isWeb ? 'initial' : 'auto',
        // maxHeight auto WILL BE passed to style attribute, but for some reason not used?
        // almost seems like a react or browser bug, but for now `initial` works
        // also, it doesn't happen for `height`, but for consistency using the same values
        maxHeight: isWeb ? 'initial' : 'auto',
        width: 0,
        maxWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 1,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})
