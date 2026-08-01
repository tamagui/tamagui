import { useState } from 'react'
import { AnimatePresence } from '@tamagui/animate-presence'
import { Button, Square, XStack, YStack, Paragraph } from 'tamagui'

/**
 * Test case for clicking to close while enter animation is still playing.
 * Uses separate show/hide buttons so we can trigger them independently.
 *
 * The element uses enter clause + exit clause with opacity, y, and scale
 * to match a real popover-like animation.
 */
export function ClickDuringEnterCase() {
  const [show, setShow] = useState(false)

  return (
    <YStack gap="4" padding="4">
      <Paragraph fontWeight="bold" fontSize="5">
        Click During Enter Animation
      </Paragraph>

      <XStack gap="2">
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
              bg="blue10"
              opacity="1 enter:0 exit:0"
              scale="1 enter:0.93 exit:0.93"
              y="0 enter:-10px exit:5px"
              animateOnly={['transform', 'opacity']}
              size={80}
            />
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}
