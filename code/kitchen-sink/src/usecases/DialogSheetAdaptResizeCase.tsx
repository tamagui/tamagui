import { useState } from 'react'
import { Button, Dialog, Paragraph, ScrollView, Sheet, XStack, YStack } from 'tamagui'

/**
 * Test case for Dialog → Sheet adapt on viewport resize
 *
 * BUG: When a Dialog is open and the viewport resizes from wide (Dialog) to narrow
 * (Sheet via Adapt), the Sheet appears empty - the portal content is not transferred.
 *
 * Expected: Dialog content should appear inside the Sheet after resize
 * Actual: Sheet is empty after resize
 *
 * To reproduce:
 * 1. Open at wide viewport (> 768px) - Dialog appears
 * 2. Resize viewport to narrow (< 768px) - Sheet should appear with content
 * 3. Content is missing from the Sheet
 */
export function DialogSheetAdaptResizeCase() {
  const [open, setOpen] = useState(false)

  return (
    <YStack padding="$4" gap="$4" items="center">
      <Button testID="open-dialog" onPress={() => setOpen(true)}>
        Open Dialog
      </Button>

      <Dialog modal open={open} onOpenChange={setOpen}>
        {/* adapt to sheet on narrow viewports */}
        <Dialog.Adapt when="maxMd">
          <Sheet zIndex={200000} modal dismissOnSnapToBottom>
            <Sheet.Frame padding="$4" gap="$4">
              <Sheet.ScrollView>
                <Dialog.Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$shadow4"
              transition="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Dialog.Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            transition="medium"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            transition="quick"
            enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
            exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
            width="90%"
            maxWidth={600}
          >
            <ScrollView>
              <YStack gap="$4" padding="$2">
                <Dialog.Title testID="dialog-title">Dialog Title</Dialog.Title>

                <Dialog.Description testID="dialog-description">
                  This content should be visible both when shown as a Dialog (wide
                  viewport) and when adapted to a Sheet (narrow viewport).
                </Dialog.Description>

                <Paragraph testID="dialog-content">
                  If you can see this text in both the Dialog and the Sheet after
                  resizing, the portal logic is working correctly.
                </Paragraph>

                <YStack gap="$2">
                  <Paragraph>Additional content to make the test more robust:</Paragraph>
                  <Paragraph testID="extra-content-1">Extra content line 1</Paragraph>
                  <Paragraph testID="extra-content-2">Extra content line 2</Paragraph>
                  <Paragraph testID="extra-content-3">Extra content line 3</Paragraph>
                </YStack>
              </YStack>
            </ScrollView>

            <XStack justify="flex-end" gap="$3" padding="$2">
              <Dialog.Close asChild displayWhenAdapted>
                <Button testID="close-dialog" theme="accent">
                  Close
                </Button>
              </Dialog.Close>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
