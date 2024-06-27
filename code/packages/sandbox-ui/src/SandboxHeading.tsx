import { Text, styled } from '@tamagui/core'

export const SandboxHeading = styled(Text, {
  tag: 'h1',
  color: '$color',
  backgroundColor: '$background',

  pressStyle: {
    backgroundColor: 'red',
  },

  variants: {
    size: {
      large: {
        fontSize: 22,
      },
      small: {
        fontSize: 16,
      },
    },
  },
})
