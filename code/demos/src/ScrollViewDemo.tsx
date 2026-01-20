import { Circle, ScrollView, Square, XStack } from 'tamagui'

export function ScrollViewDemo() {
  return (
    <ScrollView maxH={250} width="75%" bg="$background" p="$4" rounded="$4">
      <XStack flexWrap="wrap" items="center" justify="center">
        <Square m="$4" size={120} bg="$color5" />
        <Circle m="$4" size={120} bg="$color6" />
        <Square m="$4" size={120} bg="$color7" />
        <Circle m="$4" size={120} bg="$color8" />
        <Square m="$4" size={120} bg="$color9" />
        <Circle m="$4" size={120} bg="$color10" />
        <Square m="$4" size={120} bg="$color11" />
        <Circle m="$4" size={120} bg="$color12" />
      </XStack>
    </ScrollView>
  )
}
