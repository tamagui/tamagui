import { useState } from 'react'
import { Button, Square, YStack } from 'tamagui'

/**
 * Test case for the animatedBy prop.
 * Tests that animatedBy="default" correctly selects the animation driver.
 */
export function AnimatedByProp() {
  const [active, setActive] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      {/* Uses animatedBy="default" to explicitly select the default driver */}
      <Square
        testID="explicit-default"
        animatedBy="default"
        size={100}
        backgroundColor={active ? '$blue10' : '$red10'}
        opacity={active ? 1 : 0.5}
        scale={active ? 1.2 : 1}
        transition="bouncy"
      />

      {/* No animatedBy - uses context default (should behave same) */}
      <Square
        testID="context-driver"
        size={100}
        backgroundColor={active ? '$green10' : '$purple10'}
        opacity={active ? 1 : 0.5}
        scale={active ? 1.2 : 1}
        transition="bouncy"
      />

      <Button testID="toggle-trigger" onPress={() => setActive(!active)}>
        Toggle Animation
      </Button>
    </YStack>
  )
}
