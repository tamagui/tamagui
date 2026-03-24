import { useState } from 'react'
import { AnimatePresence } from '@tamagui/animate-presence'
import { Button, Square, XStack, YStack, Paragraph } from 'tamagui'

/**
 * Test case for clicking to close while enter animation is still playing.
 * Uses separate show/hide buttons so we can trigger them independently.
 *
 * The element uses enterStyle + exitStyle with opacity, y, and scale
 * to match a real popover-like animation.
 */
export function ClickDuringEnterCase() {
  const [show, setShow] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      <Paragraph fontWeight="bold" fontSize="$5">
        Click During Enter Animation
      </Paragraph>

      <XStack gap="$2">
        <Button testID="click-enter-show" onPress={() => setShow(true)}>
          Show
        </Button>
        <Button testID="click-enter-hide" onPress={() => setShow(false)}>
          Hide
        </Button>
      </XStack>

      <XStack height={120} items="center" justify="center">
        <AnimatePresence>
          {show ? (
            <Square
              key="click-enter-square"
              testID="click-enter-target"
              transition="medium"
              animateOnly={['transform', 'opacity']}
              size={80}
              bg="$blue10"
              opacity={1}
              scale={1}
              y={0}
              enterStyle={{
                opacity: 0,
                y: -10,
                scale: 0.93,
              }}
              exitStyle={{
                opacity: 0,
                y: 5,
                scale: 0.93,
              }}
            />
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}
