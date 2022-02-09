import { Stack, styled } from '@tamagui/core'

export const Separator = styled(Stack, {
  backgroundColor: '$separatorColor',
  height: 0.5,

  variants: {
    vertical: {
      true: {
        height: 'auto',
        width: 0.5,
        alignSelf: 'stretch',
        flexShrink: 0,
      },
    },
  },
})
