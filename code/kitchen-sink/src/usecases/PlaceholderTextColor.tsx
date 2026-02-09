import { Input, Text, YStack } from 'tamagui'

export const PlaceholderTextColor = () => (
  <YStack gap="$3" p="$4">
    <Text>Raw color "red":</Text>
    <Input placeholder="should be red" placeholderTextColor="red" />

    <Text>Raw hex "#00ff00":</Text>
    <Input placeholder="should be green" placeholderTextColor="#00ff00" />

    <Text>Token "$color10":</Text>
    <Input placeholder="should be $color10" placeholderTextColor="$color10" />

    <Text>Token "$blue10":</Text>
    <Input placeholder="should be blue" placeholderTextColor="$blue10" />

    <Text>No placeholderTextColor (default):</Text>
    <Input placeholder="default placeholder color" />
  </YStack>
)
