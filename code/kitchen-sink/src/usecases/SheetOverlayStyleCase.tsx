import { useState } from 'react'
import { Button, Paragraph, Sheet, YStack } from 'tamagui'

export function SheetOverlayStyleCase() {
  const [open, setOpen] = useState(false)
  const [alternate, setAlternate] = useState(false)

  return (
    <YStack padding="$4" gap="$4">
      <Button data-testid="sheet-overlay-style-open" onPress={() => setOpen(true)}>
        Open styled overlay sheet
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[45]}
        dismissOnSnapToBottom
        transition="quick"
      >
        <Sheet.Overlay
          data-testid="sheet-overlay-style-overlay"
          transition="quick"
          backgroundColor={
            alternate ? 'rgba(10, 120, 80, 0.35)' : 'rgba(210, 40, 40, 0.35)'
          }
          opacity={0.61}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Container data-testid="sheet-overlay-style-frame" padding="$4" gap="$4">
          <Sheet.Background />

          <Paragraph>Overlay style regression</Paragraph>
          <Button
            data-testid="sheet-overlay-style-toggle"
            onPress={() => setAlternate((value) => !value)}
          >
            Toggle overlay color
          </Button>
          <Button data-testid="sheet-overlay-style-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Container>
      </Sheet>
    </YStack>
  )
}
