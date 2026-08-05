import { ScrollView, View, Text, XStack } from 'tamagui'

export function TestScrollViewHideScrollbar() {
  return (
    <View padding="4" gap="4" width={300}>
      <Text>Horizontal - hidden scrollbar:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        data-testid="scroll-h-hidden"
      >
        <XStack gap="2">
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} width={80} height={40} bg="blue5">
              <Text>{i}</Text>
            </View>
          ))}
        </XStack>
      </ScrollView>

      <Text>Horizontal - visible scrollbar:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        data-testid="scroll-h-visible"
      >
        <XStack gap="2">
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} width={80} height={40} bg="green5">
              <Text>{i}</Text>
            </View>
          ))}
        </XStack>
      </ScrollView>

      <Text>Vertical - hidden scrollbar:</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        data-testid="scroll-v-hidden"
        height={120}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} height={40} bg="purple5">
            <Text>{i}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
