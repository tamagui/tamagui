import { Text, Theme, View, YStack } from 'tamagui'

export function FlatValueProgramsCase() {
  return (
    <YStack gap="4" p="4">
      <View
        data-testid="flat-background"
        width={100}
        height={100}
        backgroundColor="red hover:blue"
      />

      <View data-testid="flat-padding" p="4 max-sm:6">
        <Text>Responsive padding</Text>
      </View>

      <Theme name="dark">
        <Text data-testid="flat-theme" color="red dark:blue">
          Dark theme color
        </Text>
      </Theme>

      <View
        data-testid="flat-forward-merge"
        width={100}
        height={100}
        backgroundColor="red hover:blue"
        bg="green"
      />

      <View data-testid="flat-opacity" opacity="0.5 hover:1">
        <Text>Hover opacity</Text>
      </View>
    </YStack>
  )
}
