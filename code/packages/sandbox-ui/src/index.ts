import { View, YStack, styled } from 'tamagui'

// no `export * from '@tamagui/toast'`: tamagui already re-exports the toast
// surface, and starring both makes Toast/Toaster ambiguous (ES drops ambiguous
// star exports entirely, so they'd silently disappear from this package)
export * from 'tamagui'
export * from './SandboxHeading'
export * from './views'

// test breaking exports
// export * from './TestSolito'
// export * from './TestExpoVectorIcons'
// export { Image as ExpoImage } from 'expo-image'
// export * from 'expo-constants'

export const SimpleTest = styled(View, {
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

export const TestBorderExtraction = styled(YStack, {
  theme: 'contentContainer',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  borderRadius: '$10',
  height: '$10',
  width: '$10',
})
