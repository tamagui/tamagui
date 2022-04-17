import { Stack, styled } from '@tamagui/core'

export const Separator = styled(Stack, {
  borderColor: '$borderColor',
  flexShrink: 0,
  alignSelf: 'stretch',
  borderWidth: 0,
  borderBottomWidth: 1,
  y: -0.5,

  variants: {
    vertical: {
      true: {
        y: 0,
        x: -0.5,
        borderBottomWidth: 0,
        borderRightWidth: 1,
      },
    },
  },
})
