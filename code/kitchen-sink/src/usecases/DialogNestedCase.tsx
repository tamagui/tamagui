import { X } from '@tamagui/lucide-icons'
import {
  Adapt,
  Button,
  Dialog,
  Paragraph,
  Sheet,
  Unspaced,
  XStack,
  YStack,
} from 'tamagui'

export function DialogNestedCase() {
  return (
    <YStack gap="$4" justifyContent="center" alignItems="center" padding="$4">
      <DialogInstance />
    </YStack>
  )
}

function DialogInstance({ level = 1 }: { level?: number }) {
  const testId = level === 1 ? 'parent' : level === 2 ? 'nested' : `level-${level}`

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button data-testid={`${testId}-dialog-trigger`}>
          <Button.Text>Show Dialog (Level {level})</Button.Text>
        </Button>
      </Dialog.Trigger>

      <Adapt when="maxMd" platform="touch">
        <Sheet
          transition="medium"
          zIndex={200000}
          modal
          dismissOnSnapToBottom
          unmountChildrenWhenHidden
        >
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            transition="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          transition="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          transition={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          width={450}
          padding="$6"
          gap="$4"
        >
          <YStack data-testid={`${testId}-dialog-content`} gap="$4">
            <Dialog.Title>Dialog Level {level}</Dialog.Title>
            <Dialog.Description>
              This is dialog level {level}.{' '}
              {level < 3 ? 'You can open another dialog inside.' : ''}
            </Dialog.Description>

            <Paragraph data-testid={`${testId}-dialog-paragraph`}>
              Content for level {level}
            </Paragraph>

            <XStack alignSelf="flex-end" gap="$4">
              {/* Nested dialog - only show if level is less than 3 */}
              {level < 3 && <DialogInstance level={level + 1} />}

              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  theme="blue"
                  aria-label="Close"
                  data-testid={`${testId}-dialog-close`}
                >
                  Close
                </Button>
              </Dialog.Close>
            </XStack>

            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  right="$3"
                  top="$3"
                  size="$2"
                  circular
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
