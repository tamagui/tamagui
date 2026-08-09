import { useRef, useState } from 'react'
import { Button, Sheet, SizableText } from 'tamagui'

// a modal sheet that mounts closed and empty at page load and receives its
// frame only on the first open, like a global dialog host does. the sheet's
// animated wrapper parks off-screen the whole time, so if the layout
// measurement loop skips off-viewport nodes the frame can never be measured,
// and an unmeasured sheet never animates in. the test opens it well after
// load so no startup race can accidentally measure the wrapper first.
export function TestSheetLateOpen() {
  const [open, setOpen] = useState(false)
  const hasOpened = useRef(false)
  if (open) hasOpened.current = true

  return (
    <>
      <Button testID="open-sheet" size="$6" onPress={() => setOpen(true)}>
        Open Sheet
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        transition="quick"
        zIndex={100_000}
      >
        <Sheet.Overlay opacity={0.5} />
        {hasOpened.current ? (
          <Sheet.Frame testID="sheet-frame" p="$4" gap="$4">
            <SizableText size="$6">Sheet contents</SizableText>
            <Button testID="close-sheet" onPress={() => setOpen(false)}>
              Close
            </Button>
          </Sheet.Frame>
        ) : null}
      </Sheet>
    </>
  )
}
