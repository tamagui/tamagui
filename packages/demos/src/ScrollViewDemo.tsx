import { Circle, ScrollView, Square, XStack } from 'tamagui'

export function ScrollViewDemo() {
  return (
    <ScrollView
      maxHeight={250}
      width="75%"
      backgroundColor="$background"
      padding="$4"
      borderRadius="$4"
    >
      <XStack flexWrap="wrap" alignItems="center" justifyContent="center">
        <Square margin="$4" size={120} backgroundColor="$red9" />
        <Circle margin="$4" size={120} backgroundColor="$orange9" />
        <Square margin="$4" size={120} backgroundColor="$yellow9" />
        <Circle margin="$4" size={120} backgroundColor="$green9" />
        <Square margin="$4" size={120} backgroundColor="$blue9" />
        <Circle margin="$4" size={120} backgroundColor="$purple9" />
        <Square margin="$4" size={120} backgroundColor="$pink9" />
        <Circle margin="$4" size={120} backgroundColor="$red9" />
      </XStack>
    </ScrollView>
  )
}
