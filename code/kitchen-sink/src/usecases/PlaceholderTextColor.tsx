import { Input, Text, YStack } from 'tamagui'

export const PlaceholderTextColor = () => (
  <YStack gap="$3" p="$4">
    <Text>Token "$red10":</Text>
    <Input placeholder="should be red" placeholderTextColor="$red10" />

    <Text>Token "$green10":</Text>
    <Input placeholder="should be green" placeholderTextColor="$green10" />

    <Text>Token "$color10":</Text>
    <Input placeholder="should be $color10" placeholderTextColor="$color10" />

    <Text>Token "$blue10":</Text>
    <Input placeholder="should be blue" placeholderTextColor="$blue10" />

    <Text>No placeholderTextColor (default):</Text>
    <Input placeholder="default placeholder color" />
  </YStack>
)
