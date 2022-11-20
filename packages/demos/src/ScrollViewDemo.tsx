import { Circle, ScrollView, Square, XStack } from 'tamagui'

export function ScrollViewDemo() {
  return (
    <ScrollView maxHeight={250} w="75%" bc="$background" p="$4" br="$4">
      <XStack flexWrap="wrap" ai="center" jc="center">
        <Square m="$4" size={120} bc="$red9" />
        <Circle m="$4" size={120} bc="$orange9" />
        <Square m="$4" size={120} bc="$yellow9" />
        <Circle m="$4" size={120} bc="$green9" />
        <Square m="$4" size={120} bc="$blue9" />
        <Circle m="$4" size={120} bc="$purple9" />
        <Square m="$4" size={120} bc="$pink9" />
        <Circle m="$4" size={120} bc="$red9" />
      </XStack>
    </ScrollView>
  )
}
