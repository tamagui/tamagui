import { styled } from '@tamagui/core'
import { ThemeableStack, YStack } from '@tamagui/stacks'

export const Fieldset = styled(ThemeableStack, {
  name: 'Fieldset',

  variants: {
    horizontal: {
      true: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
  },
})
