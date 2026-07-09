import { useEffect, useState } from 'react'
import { Adapt, Button, Paragraph, Popover, Sheet, XStack, YStack } from 'tamagui'

/**
 * Repro for the popover sibling of the Dialog "content removes before animation
 * on close" bug (see DialogSheetAdaptUnmountCase).
 *
 * When a Popover adapts to a Sheet (Adapt + Sheet + Adapt.Contents), the
 * children portaled into Adapt.Contents are gated by PopoverContent's unmount
 * logic, which is driven by the *popup* exit animation, not by the Sheet's
 * slide-out. On close (especially a drag-dismiss) the popover tears its tree
 * down on the first frame while the Sheet is still animating out, so the body
 * of the sheet vanishes mid-slide.
 *
 * Same harness shape as the Dialog case: narrow viewport so `when="maxMd"`
 * activates the adapted Sheet path, and an imperative window hook to drive
 * close (the SheetOverlay covers the viewport and Pressable ignores synthetic
 * clicks).
 */
function AdaptedPopover({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <Button testID="open-popover">Open Popover</Button>
      </Popover.Trigger>

      <Adapt when="maxMd">
        <Sheet
          transition="medium"
          zIndex={250_000}
          modal
          snapPointsMode="fit"
          dismissOnSnapToBottom
        >
          <Sheet.Overlay
            bg="$shadow6"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={() => onOpenChange?.(false)}
          />

          <Sheet.Handle bg="$color5" />
          <Sheet.Container testID="sheet-frame" padding="$4" gap="$4">
            <Sheet.Background
              borderRadius="$6"
              borderBottomRightRadius={0}
              borderBottomLeftRadius={0}
              bg="$background"
            />

            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Container>
        </Sheet>
      </Adapt>

      <Popover.Content
        key="content"
        borderWidth={0.5}
        borderColor="$color5"
        bg="$background"
        padding="$4"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
      >
        {children}
      </Popover.Content>
    </Popover>
  )
}

export function PopoverAdaptSheetUnmountCase() {
  const [open, setOpen] = useState(false)

  // expose imperative open/close on window so the playwright test can drive the
  // popover without depending on synthetic clicks reaching Pressable through a
  // SheetOverlay that covers the entire viewport.
  useEffect(() => {
    ;(window as any).__popoverSetOpen = setOpen
    return () => {
      delete (window as any).__popoverSetOpen
    }
  }, [])

  return (
    <YStack p="$4" gap="$4" items="center">
      <AdaptedPopover open={open} onOpenChange={setOpen}>
        <YStack gap="$3">
          <Paragraph testID="popover-content-marker">
            unique-content-marker-popover
          </Paragraph>
          <XStack gap="$3" justify="flex-end">
            <Button testID="close-popover" onPress={() => setOpen(false)}>
              Close
            </Button>
          </XStack>
        </YStack>
      </AdaptedPopover>
    </YStack>
  )
}
