import { useState, useCallback } from 'react'
import { Button, Paragraph, Sheet, YStack } from 'tamagui'
import type { SheetTransitionEvent } from '@tamagui/sheet'

export function SheetOnAnimationCompleteCase() {
  const [open, setOpen] = useState(false)
  const [lastEvent, setLastEvent] = useState('')
  const [eventCount, setEventCount] = useState(0)

  const handleTransition = useCallback((e: SheetTransitionEvent) => {
    if (e.phase !== 'end' || e.finished === false) return
    setLastEvent(e.cause === 'close' ? 'closed' : 'opened')
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
        onTransition={handleTransition}
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
        <Sheet.Container padding="$4" data-testid="sheet-frame">
          <Sheet.Background bg="$background" />
          <Paragraph>Sheet content</Paragraph>
          <Button
            onPress={() => setOpen(false)}
            testID="sheet-close"
            data-testid="sheet-close"
          >
            Close
          </Button>
        </Sheet.Container>
      </Sheet>
    </YStack>
  )
}
