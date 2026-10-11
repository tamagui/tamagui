import { Button, Dialog, View, YStack } from 'tamagui'

/**
 * Test case for issue #3565
 * This tests that Dialog works when controlled with open={true}
 * In JSDOM (Jest), this would fail with "node.show is not a function"
 * because JSDOM doesn't implement the HTMLDialogElement.show() method
 */
export function DialogOpenControlled() {
  return (
    <YStack padding="4" gap="4">
      {/* Dialog that starts open - this is the problematic case in JSDOM */}
      <Dialog open={true} modal>
        <Dialog.Trigger asChild>
          <Button data-testid="dialog-trigger">Show Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" transition="quick" opacity="0.5 enter:0 exit:0" />
          <Dialog.Content
            key="content"
            bordered
            elevate
            transition="quick"
            x="enter:0 exit:0"
            y="enter:-20px exit:10px"
            opacity="enter:0 exit:0"
            scale="enter:0.9 exit:0.95"
            width={400}
            padding="6"
            gap="4"
          >
            <Dialog.Title>Dialog Test</Dialog.Title>
            <Dialog.Description>
              This dialog is controlled with open=true
            </Dialog.Description>
            <View data-testid="dialog-content">Hiya!</View>
            <Dialog.Close asChild>
              <Button data-testid="dialog-close">Close</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
