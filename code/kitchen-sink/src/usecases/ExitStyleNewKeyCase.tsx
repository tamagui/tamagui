import { useState } from 'react'
import { AnimatePresence } from '@tamagui/animate-presence'
import { Button, Paragraph, Square, XStack, YStack } from 'tamagui'

// regression: a style key first introduced by exitStyle (no base value, never
// painted) must still animate over the exit and gate exit completion. the bug
// emitted such keys as plain values and excluded them from the pending exit
// key set, so an element whose exitStyle only used new keys unmounted the same
// cycle, skipping the exit entirely.
export function ExitStyleNewKeyCase() {
  const [show, setShow] = useState(true)

  return (
    <YStack gap="$4" padding="$4">
      <Paragraph fontWeight="bold">ExitStyle-introduced key</Paragraph>
      <XStack gap="$2">
        <Button testID="exit-new-key-show" onPress={() => setShow(true)}>
          Show
        </Button>
        <Button testID="exit-new-key-hide" onPress={() => setShow(false)}>
          Hide
        </Button>
      </XStack>
      <XStack height={120} items="center" justify="center">
        <AnimatePresence>
          {show ? (
            <Square
              key="exit-new-key-square"
              id="exit-new-key-target"
              testID="exit-new-key-target"
              transition="300ms"
              size={80}
              bg="$blue10"
              borderColor="$red10"
              exitStyle={{
                borderWidth: 10,
                y: 40,
              }}
            />
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}
