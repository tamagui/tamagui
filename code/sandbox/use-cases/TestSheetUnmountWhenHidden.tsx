import { useState } from 'react'
import { Button, Sheet, SizableText, YStack } from 'tamagui'

// a modal sheet that unmounts its frame while closed. reopening it has to slide
// the frame up from off-screen exactly like the first open did — the frame's
// animated position lives outside the node that carries it, so a remount must
// not lose it.
export function TestSheetUnmountWhenHidden() {
  const [open, setOpen] = useState(false)

  return (
    <YStack flex={1} p="$4" gap="$4">
      <Button testID="open-sheet" size="$6" onPress={() => setOpen(true)}>
        Open Sheet
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        unmountChildrenWhenHidden
        transition="quick"
        zIndex={100_000}
      >
        <Sheet.Overlay opacity={0.5} />
        <Sheet.Frame testID="sheet-frame" p="$4" gap="$4">
          <SizableText size="$6">Sheet contents</SizableText>
          <Button testID="close-sheet" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
