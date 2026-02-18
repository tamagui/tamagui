import { useRef } from 'react'
import { Button, YStack, Text } from 'tamagui'
import { toast, Toast, useToastItem, type ToastT } from '@tamagui/toast'
import { XStack } from 'tamagui'

export function ToastNativeBurntCase() {
  const count = useRef(0)

  return (
    <Toast native position="top-center" duration={3000}>
      <Toast.Viewport>
        <Toast.List
          renderItem={({ toast: t, index }) => (
            <Toast.Item key={t.id} toast={t} index={index}>
              <ToastContent toast={t} />
            </Toast.Item>
          )}
        />
      </Toast.Viewport>

      <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4">
        <Text fontWeight="700" fontSize="$6">
          Native Burnt Toasts
        </Text>

        <YStack gap="$3" width={280}>
          <Button
            testID="burnt-toast-default"
            size="$5"
            onPress={() => {
              count.current++
              toast(`Toast #${count.current}`, {
                description: 'This is a native burnt toast.',
              })
            }}
          >
            Show Toast
          </Button>

          <Button
            testID="burnt-toast-success"
            size="$5"
            theme="green"
            onPress={() =>
              toast.success('Success!', {
                description: 'Operation completed.',
                burntOptions: { preset: 'done', haptic: 'success' },
              })
            }
          >
            Success
          </Button>

          <Button
            testID="burnt-toast-error"
            size="$5"
            theme="red"
            onPress={() =>
              toast.error('Error', {
                description: 'Something went wrong.',
                burntOptions: { preset: 'error', haptic: 'error' },
              })
            }
          >
            Error
          </Button>
        </YStack>

        <Text color="$color9" fontSize="$2" textAlign="center">
          Uses Burnt for native OS toasts. Falls back to in-app if Burnt is unavailable.
        </Text>
      </YStack>
    </Toast>
  )
}

function ToastContent({ toast: t }: { toast: ToastT }) {
  const { handleClose } = useToastItem()
  const title = typeof t.title === 'function' ? t.title() : t.title
  const description =
    typeof t.description === 'function' ? t.description() : t.description

  return (
    <XStack gap="$3" alignItems="flex-start">
      <Toast.Icon />
      <YStack flex={1} gap="$0.5">
        {title && <Toast.Title fontWeight="600">{title}</Toast.Title>}
        {description && (
          <Toast.Description color="$color9" size="$2">
            {description}
          </Toast.Description>
        )}
      </YStack>
      <Toast.Close position="absolute" top={-6} left={-6} zIndex={1} />
    </XStack>
  )
}
