import { Input, Text, YStack } from 'tamagui'

export const PlaceholderTextColor = () => (
  <YStack gap="3" p="4">
    <Text>Token "red-600":</Text>
    <Input placeholder="should be red" placeholderTextColor="red-600" />

    <Text>Token "green-600":</Text>
    <Input placeholder="should be green" placeholderTextColor="green-600" />

    <Text>Token "color-10":</Text>
    <Input placeholder="should be color-10" placeholderTextColor="color-10" />

    <Text>Token "blue-600":</Text>
    <Input placeholder="should be blue" placeholderTextColor="blue-600" />

    <Text>No placeholderTextColor (default):</Text>
    <Input placeholder="default placeholder color" />
  </YStack>
)
