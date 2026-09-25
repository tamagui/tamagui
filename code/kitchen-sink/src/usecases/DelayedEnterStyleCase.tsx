import { useState } from 'react'
import { Button, Paragraph, Square, XStack, YStack } from 'tamagui'

export function DelayedEnterStyleCase() {
  const [show, setShow] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      <Paragraph fontWeight="bold" fontSize="$5">
        Delayed Enter Style
      </Paragraph>

      <XStack gap="$2">
        <Button testID="delayed-enter-show" onPress={() => setShow(true)}>
          Show
        </Button>
        <Button testID="delayed-enter-hide" onPress={() => setShow(false)}>
          Hide
        </Button>
      </XStack>

      <XStack height={120} items="center" justify="center">
        {show ? (
          <Square
            testID="delayed-enter-target"
            transition={['quick', { delay: 1000 }]}
            size={80}
            bg="$blue10"
            enterStyle={{ opacity: 0 }}
          />
        ) : null}
      </XStack>
    </YStack>
  )
}
