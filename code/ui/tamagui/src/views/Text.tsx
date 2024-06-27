import { Text as TamaguiText, styled } from '@tamagui/core'

export const Text = styled(TamaguiText, {
  variants: {
    unstyled: {
      false: {
        color: '$color',
      },
    },
  },

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})
