import { Circle, Square, XStack } from 'tamagui'

export function ShapesDemo() {
  return (
    <XStack p="2" gap="4">
      <Square size={100} bg="color" boxShadow="0 4px 12px shadow-color" />
      <Circle size={100} bg="color" boxShadow="0 4px 12px shadow-color" />
    </XStack>
  )
}
