import { Circle, ScrollView, Square, XStack } from 'tamagui'

export function ScrollViewDemo() {
  return (
    <ScrollView maxH={250} width="75%" bg="background" p="4" rounded="4">
      <XStack flexWrap="wrap" items="center" justify="center">
        <Square m="4" bg="color-5" size={120} />
        <Circle m="4" bg="color-6" size={120} />
        <Square m="4" bg="color-7" size={120} />
        <Circle m="4" bg="color-8" size={120} />
        <Square m="4" bg="color-9" size={120} />
        <Circle m="4" bg="color-10" size={120} />
        <Square m="4" bg="color-11" size={120} />
        <Circle m="4" bg="color-12" size={120} />
      </XStack>
    </ScrollView>
  )
}
