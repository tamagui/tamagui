import { useState } from 'react'
import { Button, Square, Text, Theme, YStack } from 'tamagui'

/**
 * Tests that <Theme name={active ? 'accent' : undefined}> correctly
 * reverts to the parent theme when the condition becomes false.
 *
 * Regression test for: commit c85f5e72ecbc6599bb164f702edcaef147214e87
 * The optimization in getNextState incorrectly returned stale theme state
 * when name changed from a value to undefined.
 */
export function ThemeConditionalName() {
  const [active, setActive] = useState(false)

  return (
    <YStack padding="$4" gap="$4" alignItems="center">
      <Text id="theme-conditional-label">active: {String(active)}</Text>

      <Button id="theme-conditional-toggle" onPress={() => setActive((a) => !a)}>
        Toggle
      </Button>

      {/* parent theme square for color comparison */}
      <Square id="theme-conditional-parent" size={60} backgroundColor="$background" />

      <Theme name={active ? 'accent' : undefined}>
        <Square id="theme-conditional-child" size={60} backgroundColor="$background" />
      </Theme>
    </YStack>
  )
}
