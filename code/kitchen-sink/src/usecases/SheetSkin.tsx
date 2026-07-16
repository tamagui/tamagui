import { useState } from 'react'
import { Paragraph, YStack } from 'tamagui'
import { Button } from '../components/Button'
import { Sheet } from '../components/Sheet'

export function SheetSkin() {
  const [open, setOpen] = useState(false)

  return (
    <YStack padding="$4">
      <Button testID="sheet-skin-open" onPress={() => setOpen(true)}>
        Open copied Sheet skin
      </Button>

      <Sheet.Root
        modal
        dismissOnOverlayPress
        open={open}
        onOpenChange={setOpen}
        snapPoints={[70]}
        transition="quick"
      >
        <Sheet.Overlay testID="sheet-skin-overlay" />
        <Sheet.Handle testID="sheet-skin-handle" />
        <Sheet.Container testID="sheet-skin-container">
          <Sheet.Background testID="sheet-skin-background" />
          <Sheet.ScrollView testID="sheet-skin-scroll-view">
            <YStack gap="$3">
              <Paragraph testID="sheet-skin-title" fontSize="$6" fontWeight="600">
                Public behavior, copied aesthetics
              </Paragraph>
              <Paragraph>
                The app owns this surface, radius, handle, overlay, and spacing.
              </Paragraph>
              <Button testID="sheet-skin-close" onPress={() => setOpen(false)}>
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Container>
      </Sheet.Root>
    </YStack>
  )
}
