import { useState, useCallback } from 'react'
import { Button, Paragraph, Sheet, YStack } from 'tamagui'

export function SheetOnAnimationCompleteCase() {
  const [open, setOpen] = useState(false)
  const [lastEvent, setLastEvent] = useState('')
  const [eventCount, setEventCount] = useState(0)

  const handleAnimationComplete = useCallback((info: { open: boolean }) => {
    setLastEvent(info.open ? 'opened' : 'closed')
    setEventCount((c) => c + 1)
  }, [])

  return (
    <YStack gap="$4" padding="$4">
      <Button
        onPress={() => setOpen(true)}
        testID="sheet-open-trigger"
        data-testid="sheet-open-trigger"
      >
        Open Sheet
      </Button>

      <Paragraph data-testid="last-event">{lastEvent}</Paragraph>
      <Paragraph data-testid="event-count">{eventCount}</Paragraph>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        onAnimationComplete={handleAnimationComplete}
        transition="quick"
        modal
        dismissOnSnapToBottom
        snapPoints={[40]}
      >
        <Sheet.Overlay
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame padding="$4" bg="$background" data-testid="sheet-frame">
          <Paragraph>Sheet content</Paragraph>
          <Button
            onPress={() => setOpen(false)}
            testID="sheet-close"
            data-testid="sheet-close"
          >
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
