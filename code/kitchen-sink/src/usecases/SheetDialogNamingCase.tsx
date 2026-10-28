import { useState } from 'react'
import { Adapt, Button, Dialog, Sheet, YStack } from 'tamagui'

/**
 * Route-sheet-like composition: a modal Dialog that adapts to a modal Sheet
 * below the max-md breakpoint, with no Title or Description rendered. Both
 * layouts name their dialog with a plain aria-label instead.
 */
export function SheetDialogNamingCase() {
  const [open, setOpen] = useState(false)

  return (
    <YStack padding="4" gap="4" items="center">
      <Button testID="open-dialog" onPress={() => setOpen(true)}>
        Open settings
      </Button>

      <Dialog modal open={open} onOpenChange={setOpen}>
        <Adapt when="max-md">
          <Sheet modal dismissOnSnapToBottom aria-label="Trip settings sheet">
            <Sheet.Overlay />
            <Sheet.Container p="4" gap="2">
              <Sheet.Background />
              <Adapt.Contents />
            </Sheet.Container>
          </Sheet>
        </Adapt>

        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content aria-label="Trip settings dialog">
            <YStack gap="2" p="4">
              <Button testID="close-dialog" onPress={() => setOpen(false)}>
                Close settings
              </Button>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
