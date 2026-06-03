import { YStack } from 'tamagui'

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
    </YStack>
  )
}
