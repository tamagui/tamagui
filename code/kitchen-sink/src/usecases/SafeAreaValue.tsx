import { View, Text, YStack } from 'tamagui'

/**
 * Smoke test for the "safe" first-class value on inset/padding/margin props.
 *
 * On web each box should grow by `env(safe-area-inset-*)` on the indicated
 * side. On iOS, the same boxes should grow by the device's safe-area insets.
 *
 * Open with: ?test=SafeAreaValue
 */
export function SafeAreaValue() {
  return (
    <YStack padding="$4" gap="$4" flex={1}>
      <Text fontSize="$6" fontWeight="bold">
        Safe area as a first-class value
      </Text>

      <Text fontSize="$3" color="$gray11">
        pt="safe", padding="safe", inset="safe" — see the brown boxes below.
      </Text>

      <View backgroundColor="$blue4" pt="safe" padding="$4">
        <Text>pt="safe" (paddingTop only)</Text>
      </View>

      <View backgroundColor="$green4" padding="safe">
        <Text>padding="safe" (all four sides)</Text>
      </View>

      <View backgroundColor="$pink4" paddingHorizontal="safe" paddingVertical="$4">
        <Text>paddingHorizontal="safe"</Text>
      </View>

      <View position="relative" height={120} backgroundColor="$gray3">
        <View
          position="absolute"
          backgroundColor="$yellow4"
          inset="safe"
          padding="$2"
        >
          <Text>inset="safe" (absolute child)</Text>
        </View>
      </View>

      <View backgroundColor="$purple4" top="safe" position="relative" padding="$4">
        <Text>top="safe" (single-edge)</Text>
      </View>
    </YStack>
  )
}
