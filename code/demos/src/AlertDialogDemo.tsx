import { AlertDialog, Button, XStack, YStack } from 'tamagui'

export function AlertDialogDemo() {
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        <Button>Show Alert</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          transition="quick"
          opacity="0.5 enter:0 exit:0"
          backgroundColor="background"
        />
        <AlertDialog.Content
          elevation="$4"
          key="content"
          transition={['quick', { opacity: { overshootClamping: true } }]}
          x="0 enter:0 exit:0"
          scale="1 enter:0.9 exit:0.95"
          opacity="1 enter:0 exit:0"
          y="0 enter:-20px exit:10px"
        >
          <YStack gap="4">
            <AlertDialog.Title>Accept</AlertDialog.Title>
            <AlertDialog.Description>
              By pressing yes, you accept our terms and conditions.
            </AlertDialog.Description>

            <XStack gap="3" justify="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="accent">Accept</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}
