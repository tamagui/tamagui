import { toast } from '@tamagui/toast'
import { Button, H4, XStack, YStack } from 'tamagui'

export function ToastControl() {
  return (
    <YStack gap="$2" items="center">
      <H4>Toast demo</H4>
      <XStack gap="$2" justify="center">
        <Button
          onPress={() => {
            toast.success('Successfully saved!', {
              description: "Don't worry, we've got your data.",
            })
          }}
        >
          Show
        </Button>
        <Button
          onPress={() => {
            toast.dismiss()
          }}
        >
          Hide
        </Button>
      </XStack>
    </YStack>
  )
}
