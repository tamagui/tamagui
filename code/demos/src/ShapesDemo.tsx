import { Circle, Square, XStack } from '@tamagui/ui'

export function ShapesDemo() {
  return (
    <XStack padding="$2" gap="$4">
      <Square size={100} backgroundColor="$color" elevation="$4" />
      <Circle size={100} backgroundColor="$color" elevation="$4" />
    </XStack>
  )
}
