import { YStack, styled } from 'tamagui'

export const MyComponent = styled(YStack, {
  displayName: 'MyComponent',
  bg: 'red',

  variants: {
    blue: {
      true: {
        bg: 'blue',
      },
    },
  } as const,
})
