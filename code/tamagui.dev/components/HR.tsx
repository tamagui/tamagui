import { EnsureFlexed, YStack } from 'tamagui'

export const HR = () => (
  <YStack my="$10" mx="auto" maxWidth="50%">
    <EnsureFlexed />
    <YStack borderBottomColor="$borderColor" borderBottomWidth={1} flex={1} />
  </YStack>
)
