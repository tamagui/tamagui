import { Circle, ScrollView, Square, XStack } from 'tamagui'

export function ScrollViewDemo() {
  return (
    <ScrollView maxH={250} width="75%" bg="background" p="4" rounded="4">
      <XStack flexWrap="wrap" items="center" justify="center">
        <Square m="4" bg="color5" size={120} />
        <Circle m="4" bg="color6" size={120} />
        <Square m="4" bg="color7" size={120} />
        <Circle m="4" bg="color8" size={120} />
        <Square m="4" bg="color9" size={120} />
        <Circle m="4" bg="color10" size={120} />
        <Square m="4" bg="color11" size={120} />
        <Circle m="4" bg="color11" size={120} />
      </XStack>
    </ScrollView>
  )
}
