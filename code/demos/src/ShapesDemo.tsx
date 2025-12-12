import { Circle, Square, XStack } from 'tamagui'

export function ShapesDemo() {
  return (
    <XStack p="$2" gap="$4">
      <Square size={100} bg="$color" elevation="$4" />
      <Circle size={100} bg="$color" elevation="$4" />
    </XStack>
  )
}
