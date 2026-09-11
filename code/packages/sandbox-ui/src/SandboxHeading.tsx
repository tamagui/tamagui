import { Text, styled } from '@tamagui/core'

export const SandboxHeading = styled(Text, {
  render: 'h1',
  color: 'color',
  backgroundColor: 'background press:red',
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
