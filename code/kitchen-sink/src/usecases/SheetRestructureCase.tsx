import { useState } from 'react'
import { Button, Paragraph, Sheet, YStack } from 'tamagui'

export function SheetRestructureCase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [nonModalOpen, setNonModalOpen] = useState(false)
  const [alternate, setAlternate] = useState(false)

  return (
    <YStack padding="$4" gap="$4">
      <Button
        data-testid="sheet-restructure-modal-open"
        onPress={() => setModalOpen(true)}
      >
        Open modal sheet
      </Button>
      <Paragraph data-testid="sheet-restructure-modal-state">
        {modalOpen ? 'modal open' : 'modal closed'}
      </Paragraph>

      <Sheet
        modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        snapPoints={[45]}
        dismissOnSnapToBottom
        transition="quick"
      >
        <Sheet.Handle data-testid="sheet-restructure-modal-handle" />
        <Sheet.Container
          data-testid="sheet-restructure-modal-container"
          padding="$4"
          gap="$4"
        >
          <Sheet.Background bg="$background" />
          <Paragraph>Modal sheet content</Paragraph>
          <Button
            data-testid="sheet-restructure-overlay-toggle"
            onPress={() => setAlternate((value) => !value)}
          >
            Toggle overlay color
          </Button>
        </Sheet.Container>
        <Sheet.Overlay
          data-testid="sheet-restructure-modal-overlay"
          transition="quick"
          backgroundColor={
            alternate ? 'rgba(10, 120, 80, 0.35)' : 'rgba(210, 40, 40, 0.35)'
          }
          opacity={0.61}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
      </Sheet>

      <Button
        data-testid="sheet-restructure-nonmodal-open"
        onPress={() => setNonModalOpen(true)}
      >
        Open non-modal sheet
      </Button>
      <Paragraph data-testid="sheet-restructure-nonmodal-state">
        {nonModalOpen ? 'non-modal open' : 'non-modal closed'}
      </Paragraph>

      <Sheet
        open={nonModalOpen}
        onOpenChange={setNonModalOpen}
        snapPoints={[35]}
        dismissOnSnapToBottom
        transition="quick"
      >
        <Sheet.Handle />
        <Sheet.Container data-testid="sheet-restructure-nonmodal-container" padding="$4">
          <Sheet.Background bg="$background" />
          <Paragraph>Non-modal sheet content</Paragraph>
        </Sheet.Container>
        <Sheet.Overlay
          data-testid="sheet-restructure-nonmodal-overlay"
          backgroundColor="rgba(20, 20, 20, 0.2)"
        />
      </Sheet>
    </YStack>
  )
}
