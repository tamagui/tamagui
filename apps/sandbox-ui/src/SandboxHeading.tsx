import { Text, styled } from '@tamagui/core'

export const SandboxHeading = styled(Text, {
  tag: 'h1',
  color: '$color',
  backgroundColor: '$background',

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
