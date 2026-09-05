import { useState } from 'react'
import { Adapt, Dialog, Paragraph, Popover, Sheet, YStack } from 'tamagui'
import { Button } from '../components/Button'

/**
 * An adapting component only adapts on its OWN <Adapt />.
 *
 * This Dialog has no Adapt at all. Its content holds a Popover that does have
 * one, so a parent that searches its whole child element tree for an <Adapt />
 * finds the Popover's and adapts the Dialog too - the dialog content then
 * publishes into a slot nothing renders and disappears entirely.
 *
 * `when={true}` on the Popover keeps the adapted path viewport-independent.
 */
export function AdaptNestedBoundaryCase() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <YStack p="4" gap="4" items="center">
      <Button testID="open-dialog" onPress={() => setDialogOpen(true)}>
        Open Dialog
      </Button>

      <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" opacity="0.5 enter:0 exit:0" />

          <Dialog.Content
            key="content"
            testID="dialog-content"
            padding="4"
            gap="4"
            width={420}
          >
            <Dialog.Title>Dialog with no Adapt</Dialog.Title>

            <Paragraph testID="dialog-content-marker">
              unique-content-marker-dialog
            </Paragraph>

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <Popover.Trigger asChild>
                <Button testID="open-popover">Open Popover</Button>
              </Popover.Trigger>

              <Adapt when={true}>
                <Sheet transition="medium" zIndex={250_000} modal snapPointsMode="fit">
                  <Sheet.Overlay bg="shadow6" opacity="enter:0 exit:0" />
                  <Sheet.Handle bg="color5" />
                  <Sheet.Container testID="sheet-frame" padding="4" gap="4">
                    <Sheet.Background bg="background" borderRadius="6" />
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Container>
                </Sheet>
              </Adapt>

              <Popover.Content key="popover-content" padding="4" bg="background">
                <Paragraph testID="popover-content-marker">
                  unique-content-marker-popover
                </Paragraph>
              </Popover.Content>
            </Popover>

            <Button testID="close-dialog" onPress={() => setDialogOpen(false)}>
              Close
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
