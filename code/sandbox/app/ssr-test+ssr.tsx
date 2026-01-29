import { Button, View, YStack } from 'tamagui'

export default function SSRTestPage() {
  return (
    <YStack p="$4" gap="$4">
      <View
        data-testid="theme-light-box"
        width={100}
        height={100}
        bg="$color3"
        boxShadow="0 2px 4px $shadowColor"
        $theme-light={{
          boxShadow: '0 4px 8px $color5',
        }}
      />

      <Button
        data-testid="theme-light-button"
        size="$3"
        bg="$color3"
        boxShadow="inset 0 -2px 0 1px $color1"
        $theme-light={{
          boxShadow: 'inset 0 -2px 0 1px $color5',
        }}
      >
        Theme Test Button
      </Button>
    </YStack>
  )
}
