import { Sheet } from '@tamagui/sheet'
import { useState } from 'react'
import { Button, styled, Text, View } from 'tamagui'

const RuntimeFrame = styled(View, {})

/**
 * The island: a modal sheet needs a portal, measurement and the animation
 * runtime, none of which the zero graph can contain. It is built as its own
 * full-runtime entry and mounted through the generated loader.
 */
export default function DetailsIsland() {
  const [open, setOpen] = useState(false)
  const runtimeWidth = Number((globalThis as any).__zeroRuntimeIslandWidth ?? 137)
  return (
    <View data-testid="island-root">
      <Button data-testid="island-open" onPress={() => setOpen(true)}>
        open details
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[60]}
        transition="quick"
      >
        <Sheet.Overlay />
        <Sheet.Container data-testid="island-frame" backgroundColor="$background">
          <RuntimeFrame
            data-testid="island-runtime-inline"
            width={`${runtimeWidth}px hover:${runtimeWidth + 10}px`}
            padding={20}
            gap={8}
          >
            <Text data-testid="island-text" color="$color">
              this subtree runs the full Tamagui runtime
            </Text>
            <Button data-testid="island-close" onPress={() => setOpen(false)}>
              close
            </Button>
          </RuntimeFrame>
        </Sheet.Container>
      </Sheet>
    </View>
  )
}
