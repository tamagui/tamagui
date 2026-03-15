import { Dialog } from '@tamagui/dialog'
import { toast, Toast, useToasts, type ToastPosition } from '@tamagui/toast'
import { useRef, useState } from 'react'
import { Button, H4, Paragraph, XStack, YStack } from 'tamagui'

export function ToastAboveDialogCase() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const count = useRef(0)

  const showToast = () => {
    count.current++
    toast(`Toast #${count.current}`, {
      description: 'This should appear above the dialog.',
    })
  }

  return (
    <Toast position="top-center">
      <Toast.Viewport>
        <ToastList />
      </Toast.Viewport>

      <YStack gap="$4" padding="$4">
        <H4>Toast Above Dialog Test</H4>

        <XStack gap="$3">
          <Button testID="open-dialog" onPress={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
          <Button testID="show-toast" onPress={showToast}>
            Show Toast
          </Button>
        </XStack>

        <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Dialog.Content
              key="content"
              elevate
              bordered
              testID="dialog-content"
              enterStyle={{ y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ y: 10, opacity: 0, scale: 0.95 }}
              gap="$4"
              padding="$4"
            >
              <H4>Dialog</H4>
              <Paragraph>
                Click "Show Toast" to verify toasts appear above this dialog.
              </Paragraph>
              <Button testID="show-toast-from-dialog" onPress={showToast}>
                Show Toast From Dialog
              </Button>
              <Dialog.Close asChild>
                <Button testID="close-dialog">Close</Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </YStack>
    </Toast>
  )
}

function ToastList() {
  const { toasts } = useToasts()

  return (
    <>
      {toasts.map((t, index) => (
        <Toast.Item key={t.id} toast={t} index={index} testID="toast-item">
          <XStack gap="$3" alignItems="flex-start">
            <YStack flex={1} gap="$1">
              <Toast.Title>
                {typeof t.title === 'function' ? t.title() : t.title}
              </Toast.Title>
              {t.description && (
                <Toast.Description>
                  {typeof t.description === 'function' ? t.description() : t.description}
                </Toast.Description>
              )}
            </YStack>
            <Toast.Close testID="toast-close-button" />
          </XStack>
        </Toast.Item>
      ))}
    </>
  )
}
