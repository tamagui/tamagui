import { YStack } from 'tamagui'

export function AnimatedDOMPropsCase() {
  return (
    <YStack
      testID="animated-dom-props"
      nativeID="animated-dom-props-native"
      transition="200ms"
      bg="$color1"
      p="$4"
    />
  )
}
