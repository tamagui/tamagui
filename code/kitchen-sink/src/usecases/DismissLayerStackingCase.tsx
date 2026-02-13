import { Button, Dialog, Input, Paragraph, Popover, XStack, YStack } from 'tamagui'
import { useState } from 'react'

// tests that when multiple dismissable layers are open, ESC closes the topmost one
export function DismissLayerStackingCase() {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <YStack padding="$4" gap="$4">
      <Paragraph>
        Test: Open popover, then open dialog from inside popover. Press ESC - dialog
        should close first, not the popover.
      </Paragraph>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Popover.Trigger asChild>
          <Button testID="popover-trigger">Open Popover</Button>
        </Popover.Trigger>

        <Popover.Content
          testID="popover-content"
          padding="$4"
          elevate
          bordered
        >
          <YStack gap="$3" width={280}>
            <Paragraph>Popover Content</Paragraph>
            <Input testID="popover-input" placeholder="Popover input" />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <Button testID="dialog-trigger">Open Dialog</Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay
                  testID="dialog-overlay"
                  key="overlay"
                  opacity={0.5}
                />
                <Dialog.Content
                  testID="dialog-content"
                  bordered
                  elevate
                  key="content"
                >
                  <YStack gap="$3" padding="$2">
                    <Dialog.Title>Dialog Title</Dialog.Title>
                    <Dialog.Description>
                      Press ESC to close this dialog. The popover should stay open.
                    </Dialog.Description>
                    <Input testID="dialog-input" placeholder="Dialog input" autoFocus />
                    <XStack gap="$3" justifyContent="flex-end">
                      <Dialog.Close asChild>
                        <Button testID="dialog-close">Close Dialog</Button>
                      </Dialog.Close>
                    </XStack>
                  </YStack>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>

            <Popover.Close asChild>
              <Button testID="popover-close">Close Popover</Button>
            </Popover.Close>
          </YStack>
        </Popover.Content>
      </Popover>

      {/* status display for tests */}
      <YStack gap="$2">
        <Paragraph testID="popover-status">
          Popover: {popoverOpen ? 'open' : 'closed'}
        </Paragraph>
        <Paragraph testID="dialog-status">
          Dialog: {dialogOpen ? 'open' : 'closed'}
        </Paragraph>
      </YStack>
    </YStack>
  )
}
