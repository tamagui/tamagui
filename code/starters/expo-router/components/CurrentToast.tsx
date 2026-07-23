import { Button, H4, XStack, YStack, toast } from 'tamagui'

export function ToastControl() {
  return (
    <YStack gap="$2" items="center">
      <H4>Toast demo</H4>
      <XStack gap="$2" justify="center">
        <Button
          testID="toast-show"
          onPress={() => {
            toast('Successfully saved!', {
              description: "Don't worry, we've got your data.",
            })
          }}
        >
          Show
        </Button>
        <Button
          testID="toast-hide"
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
