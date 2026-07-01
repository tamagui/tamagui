import { useState } from 'react'
import { Button, Text, View, YStack } from 'tamagui'

// visibility="hidden":
// - web: native CSS visibility: hidden (still takes layout space, not interactive)
// - native: expands to opacity: 0 + pointerEvents: 'none' (takes layout space, not interactive)
export function VisibilityCase() {
  const [hidden, setHidden] = useState(true)
  const [pressedHidden, setPressedHidden] = useState(0)
  const [pressedVisible, setPressedVisible] = useState(0)

  return (
    <YStack gap="$4" padding="$4">
      <Text data-testid="vis-state">hidden: {String(hidden)}</Text>

      <Button data-testid="vis-toggle" onPress={() => setHidden((v) => !v)}>
        toggle visibility
      </Button>

      {/* the hidden box still occupies layout space; clicks should NOT register */}
      <View
        data-testid="vis-box"
        // @ts-expect-error - visibility is being added as a cross-platform style
        visibility={hidden ? 'hidden' : 'visible'}
        backgroundColor="$customRed"
        width={120}
        height={120}
        onPress={() => setPressedHidden((n) => n + 1)}
        cursor="pointer"
      >
        <Text>hidden when hidden</Text>
      </View>

      <Text data-testid="vis-pressed-hidden">pressed hidden: {pressedHidden}</Text>

      {/* control: always visible, clicks SHOULD register */}
      <View
        data-testid="vis-box-control"
        // @ts-expect-error - visibility is being added as a cross-platform style
        visibility="visible"
        backgroundColor="$customBlue"
        width={120}
        height={120}
        onPress={() => setPressedVisible((n) => n + 1)}
        cursor="pointer"
      >
        <Text>always visible</Text>
      </View>

      <Text data-testid="vis-pressed-visible">pressed visible: {pressedVisible}</Text>
    </YStack>
  )
}
