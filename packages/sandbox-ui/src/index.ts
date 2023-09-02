import { YStack, styled } from 'tamagui'

export * as lucideIcons from '@tamagui/lucide-icons'

export * from 'tamagui'
export * from '@tamagui/toast'
export * from './SandboxHeading'
export * from './views'

// test breaking exports
// export * from './TestSolito'
export * from './TestExpoVectorIcons'
export * from 'expo-constants'

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
