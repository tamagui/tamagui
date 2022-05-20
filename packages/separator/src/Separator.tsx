import { Stack, styled } from '@tamagui/core'

export const Separator = styled(Stack, {
  name: 'Separator',
  borderColor: '$borderColorHover',
  flexShrink: 0,
  borderWidth: 0,
  flex: 1,
  height: 0,
  borderBottomWidth: 1,
  y: -0.5,

  variants: {
    vertical: {
      true: {
        y: 0,
        x: -0.5,
        height: 'auto',
        width: 0,
        borderBottomWidth: 0,
        borderRightWidth: 1,
      },
    },
  },
})
