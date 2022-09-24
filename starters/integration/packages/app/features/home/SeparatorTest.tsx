// debug
import { ScrollView, CustomSeparator, YStack } from '@my/ui'

export const SeparatorTest = () => {
  return (
    <ScrollView w="100%">
      <YStack w="100%" bc="black" p="$10">
        <CustomSeparator />
      </YStack>
    </ScrollView>
  )
}
