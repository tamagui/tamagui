import { styled, YStack } from 'tamagui'

export const MyComponent = styled(YStack, {
  name: 'MyComponent',
  bc: 'red',

  variants: {
    blue: {
      true: {
        backgroundColor: 'blue',
      },
    },
  } as const,
})
