import { useEffect, useState } from 'react'
import { Button, Paragraph, Sheet, Dialog as TamaguiDialog, YStack } from 'tamagui'

/**
 * Repro for: "adapted sheet never shows again after the first open/close".
 *
 * The key ingredient is `unmountChildrenWhenHidden` on a fit-mode sheet: on
 * reopen the frame remounts before its children, so the sheet briefly
 * measures a near-empty frame. That transient measurement retargets the
 * position spring to a nearly-closed snap point, and starting that second
 * animation makes the driver fire the superseded first animation's owed
 * completion callback — which synced at.current back to the stale target.
 * When the real content height landed, animateTo saw at.current already at
 * the target and bailed, leaving the frame parked offscreen with no
 * animation running.
 */
export function DialogSheetAdaptReopenCase() {
  const [open, setOpen] = useState(false)

  // let the playwright test drive open/close imperatively — the sheet overlay
  // covers the viewport so synthetic clicks don't reliably reach Pressable
  useEffect(() => {
    ;(window as any).__dialogSetOpen = setOpen
    return () => {
      delete (window as any).__dialogSetOpen
    }
  }, [])

  return (
    <YStack p="$4" gap="$4" items="center">
      <Button testID="open-dialog" onPress={() => setOpen(true)}>
        Open Dialog
      </Button>

      <TamaguiDialog modal open={open} onOpenChange={setOpen}>
        <TamaguiDialog.Adapt when="maxMd">
          <Sheet
            transition="medium"
            zIndex={250_000}
            modal
            snapPointsMode="fit"
            dismissOnSnapToBottom
            unmountChildrenWhenHidden
          >
            <Sheet.Overlay
              bg="$shadow6"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              onPress={() => setOpen(false)}
            />
            <Sheet.Frame testID="sheet-frame" bg="$background">
              <YStack p="$4" gap="$4">
                <TamaguiDialog.Adapt.Contents />
              </YStack>
            </Sheet.Frame>
          </Sheet>
        </TamaguiDialog.Adapt>

        <TamaguiDialog.Portal>
          <TamaguiDialog.Overlay key="overlay" onPress={() => setOpen(false)} />
          <TamaguiDialog.Content key="content">
            <YStack gap="$3">
              <TamaguiDialog.Title size="$6">Reopen Dialog</TamaguiDialog.Title>
              <TamaguiDialog.Description>
                This sheet must show every time it opens, not only the first.
              </TamaguiDialog.Description>
              <Paragraph testID="dialog-content-marker">reopen-content-marker</Paragraph>
              <TamaguiDialog.Close asChild displayWhenAdapted>
                <Button testID="close-dialog">Close</Button>
              </TamaguiDialog.Close>
            </YStack>
          </TamaguiDialog.Content>
        </TamaguiDialog.Portal>
      </TamaguiDialog>
    </YStack>
  )
}
