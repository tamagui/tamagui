import { Stack, styled } from '@tamagui/core'

export const Separator = styled(Stack, {
  backgroundColor: '$borderColor',
  opacity: 1,
  flex: 1,
  height: 1,

  variants: {
    vertical: {
      true: {
        height: 'auto',
        width: 1,
      },
    },
  },
})
