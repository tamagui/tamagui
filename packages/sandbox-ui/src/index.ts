import { Stack, ThemeableStack, YStack, styled } from 'tamagui'

export * as lucideIcons from '@tamagui/lucide-icons'

export * from 'tamagui'
export * from '@tamagui/toast'
export * from './SandboxHeading'
export * from './views'

// test breaking exports
// export * from './TestSolito'
// export * from './TestExpoVectorIcons'
// export { Image as ExpoImage } from 'expo-image'
export * from 'expo-constants'

export const SimpleTest = styled(Stack, {
  width: 100,
  height: 100,
  backgroundColor: 'blue',

  pressStyle: {
    backgroundColor: 'red',
  },
})

export const Test14Component = styled(YStack, {
  name: 'MyComponent',

  variants: {
    fullbleed: {
      true: {},
      false: {
        padding: '$4',
      },
    },
  } as const,

  defaultVariants: {
    fullbleed: false,
  },
})

export const TestBorderExtraction = styled(ThemeableStack, {
  theme: 'contentContainer',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  borderRadius: '$10',
  height: '$10',
  width: '$10',
})
