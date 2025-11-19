import { YStack, styled } from '@tamagui/ui'

export const MyComponent = styled(YStack, {
  name: 'MyComponent',
  bg: 'red',

  variants: {
    blue: {
      true: {
        bg: 'blue',
      },
    },
  } as const,
})
