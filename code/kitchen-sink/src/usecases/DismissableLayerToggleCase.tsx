import { Dismissable } from '@tamagui/dismissable'
import { useState } from 'react'
import { Button, Paragraph, YStack } from 'tamagui'

// exercises C1: two stacked dismissable layers whose disableOutsidePointerEvents
// prop toggles true->false->true. the body pointer-events bookkeeping must stay
// symmetric so the body is only "none" while at least one layer disables it.
export function DismissableLayerToggleCase() {
  const [layer1Disable, setLayer1Disable] = useState(true)
  const [layer2Disable, setLayer2Disable] = useState(true)
  const [outsideClicks, setOutsideClicks] = useState(0)

  return (
    <YStack gap="$3" padding="$4">
      {/* the toggle controls sit in a pointerEvents=auto island so they stay
          clickable even while a layer disables outside pointer events */}
      <YStack gap="$3" pointerEvents="auto">
        <Button
          id="toggle-layer1"
          onPress={() => setLayer1Disable((v) => !v)}
          alignSelf="flex-start"
        >
          layer1 disable: {String(layer1Disable)}
        </Button>
        <Button
          id="toggle-layer2"
          onPress={() => setLayer2Disable((v) => !v)}
          alignSelf="flex-start"
        >
          layer2 disable: {String(layer2Disable)}
        </Button>
      </YStack>

      {/* the outside target inherits the body pointer-events, so it is only
          clickable once no layer disables outside pointer events */}
      <Button
        id="outside-button"
        onPress={() => setOutsideClicks((c) => c + 1)}
        alignSelf="flex-start"
      >
        outside
      </Button>
      <Paragraph id="outside-clicks">{outsideClicks}</Paragraph>

      <Dismissable disableOutsidePointerEvents={layer1Disable}>
        <YStack id="layer1" padding="$2" backgroundColor="$background">
          <Paragraph>layer 1</Paragraph>
        </YStack>
      </Dismissable>

      <Dismissable disableOutsidePointerEvents={layer2Disable}>
        <YStack id="layer2" padding="$2" backgroundColor="$background">
          <Paragraph>layer 2</Paragraph>
        </YStack>
      </Dismissable>
    </YStack>
  )
}
