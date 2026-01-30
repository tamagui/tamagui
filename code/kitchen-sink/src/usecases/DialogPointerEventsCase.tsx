import { useState } from 'react'
import { Button, Dialog, View, YStack } from 'tamagui'

/**
 * Test case for dialog pointer events unlock timing
 * Uses a slow exit animation to verify that pointer events on elements
 * behind the dialog are restored immediately when the dialog closes,
 * NOT after the animation completes.
 */
export function DialogPointerEventsCase() {
  const [open, setOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  return (
    <YStack padding="$4" gap="$4">
      <Button data-testid="background-button" onPress={() => setClickCount((c) => c + 1)}>
        Background Button (clicked: {clickCount})
      </Button>

      <View data-testid="click-count">{clickCount}</View>

      <Dialog open={open} onOpenChange={setOpen} modal>
        <Dialog.Trigger asChild>
          <Button data-testid="dialog-trigger">Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            transition="lazy"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            key="content"
            bordered
            elevate
            transition="lazy"
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            width={400}
            padding="$6"
            gap="$4"
          >
            <Dialog.Title>Slow Animation Dialog</Dialog.Title>
            <Dialog.Description>
              This dialog has a slow exit animation. When closed, the background button
              should be clickable immediately, not after the animation finishes.
            </Dialog.Description>
            <Dialog.Close asChild>
              <Button data-testid="dialog-close">Close</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
