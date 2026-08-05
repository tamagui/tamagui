import { useState } from 'react'
import { AnimatePresence } from '@tamagui/animate-presence'
import { Button, Square, XStack, YStack, Paragraph } from 'tamagui'

/**
 * A property declared ONLY through lifecycle clauses, with no base value.
 * The resting value is synthesized (opacity 1), so the enter clause is the
 * only thing that can make the first painted frame differ from resting.
 * If the enter frame never reaches the screen the square just appears at
 * full opacity with no ramp.
 */
export function LifecycleOnlyEnterCase() {
  const [show, setShow] = useState(false)

  return (
    <YStack gap="4" padding="4">
      <Paragraph fontWeight="bold" fontSize="5">
        Lifecycle-only Enter Clause
      </Paragraph>

      <XStack gap="2">
        <Button testID="lifecycle-enter-show" onPress={() => setShow(true)}>
          Show
        </Button>
        <Button testID="lifecycle-enter-hide" onPress={() => setShow(false)}>
          Hide
        </Button>
      </XStack>

      <XStack height={120} items="center" justify="center">
        <AnimatePresence>
          {show ? (
            <Square
              key="lifecycle-enter-square"
              testID="lifecycle-enter-target"
              transition="medium"
              bg="blue-600"
              opacity="enter:0 exit:0"
              animateOnly={['opacity']}
              size={80}
            />
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}
