import { useState } from 'react'
import { Button, Dialog, Paragraph, Theme, YStack } from 'tamagui'

// dialog content wrapped in a nameless <Theme forceClassName>, which only emits the
// parent's theme classes. a live light -> dark switch while open must re-theme it.
export function DialogForceClassNameThemeCase() {
  const [open, setOpen] = useState(false)

  return (
    <YStack padding="4" items="center">
      <Button testID="open-dialog" onPress={() => setOpen(true)}>
        Open Dialog
      </Button>

      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" />
          <Dialog.Content key="content" bordered width="90%" maxWidth={600}>
            <Theme forceClassName>
              <YStack gap="4" padding="2">
                <Dialog.Title>Dialog Title</Dialog.Title>
                <Paragraph testID="dialog-content">
                  This text follows the page theme while the dialog stays open.
                </Paragraph>
              </YStack>
            </Theme>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
