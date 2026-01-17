import { Circle, ScrollView, Square, XStack } from 'tamagui'

export function ScrollViewDemo() {
  return (
    <ScrollView maxH={250} width="75%" bg="$background" p="$4" rounded="$4">
      <XStack flexWrap="wrap" items="center" justify="center">
        <Square m="$4" size={120} bg={'$red9' as any} />
        <Circle m="$4" size={120} bg={'$orange9' as any} />
        <Square m="$4" size={120} bg={'$yellow9' as any} />
        <Circle m="$4" size={120} bg={'$red9' as any} />
        <Square m="$4" size={120} bg={'$blue9' as any} />
        <Circle m="$4" size={120} bg={'$purple9' as any} />
        <Square m="$4" size={120} bg={'$pink9' as any} />
        <Circle m="$4" size={120} bg={'$red9' as any} />
      </XStack>
    </ScrollView>
  )
}
