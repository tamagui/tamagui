import { YStack, Text, Input } from 'tamagui'

export function FocusWithinCase() {
  return (
    <YStack
      data-testid="parent"
      focusWithinStyle={{ borderColor: 'red', borderWidth: 2 }}
      padding={20}
      borderColor="#ddd"
      borderWidth={1}
    >
      <Text>Parent should get red border when child focused</Text>
      <Input placeholder="Focus me" marginTop={20} />
    </YStack>
  )
}
