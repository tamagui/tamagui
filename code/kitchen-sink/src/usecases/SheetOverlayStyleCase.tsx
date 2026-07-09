import { useState } from 'react'
import { Button, Paragraph, Sheet, YStack } from 'tamagui'

export function SheetOverlayStyleCase() {
  const [open, setOpen] = useState(false)
  const [alternate, setAlternate] = useState(false)
  const [escapeModalOpen, setEscapeModalOpen] = useState(false)
  const [escapeNonModalOpen, setEscapeNonModalOpen] = useState(false)

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
          data-overlay-state={alternate ? 'alternate' : 'initial'}
          transition="quick"
          backgroundColor={
            alternate ? 'rgba(10, 120, 80, 0.35)' : 'rgba(210, 40, 40, 0.35)'
          }
          opacity={0.61}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        >
          <Paragraph data-testid="sheet-overlay-style-overlay-copy">
            {alternate ? 'alternate overlay props' : 'initial overlay props'}
          </Paragraph>
        </Sheet.Overlay>

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

      <Button
        data-testid="sheet-escape-modal-open"
        onPress={() => setEscapeModalOpen(true)}
      >
        Open modal escape sheet
      </Button>
      <Paragraph data-testid="sheet-escape-modal-state">
        {escapeModalOpen ? 'modal-open' : 'modal-closed'}
      </Paragraph>
      <Sheet
        modal
        open={escapeModalOpen}
        onOpenChange={setEscapeModalOpen}
        snapPoints={[35]}
        transition="quick"
      >
        <Sheet.Overlay />
        <Sheet.Container data-testid="sheet-escape-modal-frame" padding="$4">
          <Sheet.Background />
          <Paragraph>Modal escape sheet</Paragraph>
        </Sheet.Container>
      </Sheet>

      <Button
        data-testid="sheet-escape-nonmodal-open"
        onPress={() => setEscapeNonModalOpen(true)}
      >
        Open non-modal escape sheet
      </Button>
      <Paragraph data-testid="sheet-escape-nonmodal-state">
        {escapeNonModalOpen ? 'nonmodal-open' : 'nonmodal-closed'}
      </Paragraph>
      <Sheet
        open={escapeNonModalOpen}
        onOpenChange={setEscapeNonModalOpen}
        snapPoints={[35]}
        transition="quick"
      >
        <Sheet.Overlay />
        <Sheet.Container data-testid="sheet-escape-nonmodal-frame" padding="$4">
          <Sheet.Background />
          <Paragraph>Non-modal escape sheet</Paragraph>
        </Sheet.Container>
      </Sheet>
    </YStack>
  )
}
