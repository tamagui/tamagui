import { Text, YStack } from 'tamagui'

export function StyleCompatCase() {
  return (
    <YStack gap="$4" p="$4" width={240}>
      <YStack
        testID="style-compat-flex-parent"
        height={80}
        width={120}
        borderWidth={1}
        borderColor="$borderColor"
      >
        <YStack testID="style-compat-flex-child" flex={1} minH={20} />
      </YStack>

      <Text testID="style-compat-unitless-line-height" fontSize={20} lineHeight={1.2}>
        Unitless line height
      </Text>

      <Text testID="style-compat-absolute-line-height" fontSize={20} lineHeight="24px">
        Absolute line height
      </Text>
    </YStack>
  )
}
