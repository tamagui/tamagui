import { X } from '@tamagui/lucide-icons'
import {
  Adapt,
  Button,
  Dialog,
  Paragraph,
  Sheet,
  Unspaced,
  View,
  XStack,
  YStack,
} from 'tamagui'

export function DialogNestedCase() {
  return (
    <View gap="$4" justifyContent="center" alignItems="center" padding="$4">
      <DialogInstance />
    </View>
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
          animation="medium"
          zIndex={200000}
          modal
          dismissOnSnapToBottom
          unmountChildrenWhenHidden
        >
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadow6"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadow6"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          paddingVertical="$4"
          paddingHorizontal="$6"
          elevate
          borderRadius="$6"
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: 20, opacity: 0 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          data-testid={`${testId}-dialog-content`}
        >
          <Dialog.Title>Dialog Level {level}</Dialog.Title>
          <Dialog.Description>
            This is dialog level {level}. {level < 3 ? 'You can open another dialog inside.' : ''}
          </Dialog.Description>

          <Paragraph data-testid={`${testId}-dialog-paragraph`}>
            Content for level {level}
          </Paragraph>

          <XStack alignSelf="flex-end" gap="$4">
            {/* Nested dialog - only show if level is less than 3 */}
            {level < 3 && <DialogInstance level={level + 1} />}

            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="accent" aria-label="Close" data-testid={`${testId}-dialog-close`}>
                Close
              </Button>
            </Dialog.Close>
          </XStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button position="absolute" right="$3" size="$2" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
