import { Sheet } from '@tamagui/sheet'
import { useState } from 'react'
import { Button, Text, View } from 'tamagui'

/**
 * The island: a full-runtime component that needs portals, measurement, and the
 * animation runtime, which is exactly what the zero graph cannot contain.
 */
export default function SheetIsland() {
  const [open, setOpen] = useState(false)
  return (
    <View data-testid="island-root">
      <Button data-testid="island-open" onPress={() => setOpen(true)}>
        open sheet
      </Button>
      <Sheet
        data-testid="island-sheet"
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[60]}
        transition="quick"
      >
        <Sheet.Overlay />
        <Sheet.Container data-testid="island-portal-frame" backgroundColor="$background">
          <View padding={20} gap={8}>
            <Text data-testid="island-portal-text" color="$color">
              portaled island content
            </Text>
            <View data-testid="island-unique" width={137} height={19} />
          </View>
        </Sheet.Container>
      </Sheet>
    </View>
  )
}
