import { useRef, useState } from 'react'
import { Button, SizableText, XStack, YStack, Text } from 'tamagui'
import {
  toast,
  Toast,
  useToastItem,
  requestNotificationPermission,
  type ToastPosition,
  type ToastT,
} from '@tamagui/toast'

export function ToastNativeNotificationCase() {
  const [permission, setPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const count = useRef(0)

  const refreshPermission = () => {
    setPermission(
      typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
    )
  }

  return (
    <Toast native position="top-right" duration={5000}>
      <Toast.Viewport>
        <Toast.List
          renderItem={({ toast: t, index }) => (
            <Toast.Item key={t.id} toast={t} index={index}>
              <ToastContent toast={t} />
            </Toast.Item>
          )}
        />
      </Toast.Viewport>

      <YStack gap="$4" padding="$4" maxWidth={420}>
        <Text fontWeight="700" fontSize="$5">
          Native Web Notifications
        </Text>

        <YStack gap="$2">
          <Text fontSize="$3" color="$color11">
            Permission: {permission}
          </Text>

          <Button
            testID="request-permission"
            theme={permission === 'granted' ? 'green' : 'accent'}
            onPress={async () => {
              await requestNotificationPermission()
              refreshPermission()
            }}
          >
            {permission === 'granted' ? 'Permission Granted' : 'Request Permission'}
          </Button>
        </YStack>

        <YStack gap="$2">
          <Button
            testID="show-native-toast"
            onPress={() => {
              count.current++
              toast(`Native toast #${count.current}`, {
                description: 'Should appear in OS notification center.',
              })
            }}
          >
            Show Toast
          </Button>

          <Button
            testID="show-native-toast-success"
            theme="green"
            onPress={() =>
              toast.success('Upload complete', {
                description: 'Your file was uploaded successfully.',
              })
            }
          >
            Show Success Toast
          </Button>

          <Button
            testID="show-native-toast-error"
            theme="red"
            onPress={() =>
              toast.error('Connection lost', {
                description: 'Please check your internet connection.',
              })
            }
          >
            Show Error Toast
          </Button>
        </YStack>

        <SizableText size="$2" color="$color9">
          When permission is granted, toasts go to the OS notification center. Otherwise
          they fall back to in-app toasts.
        </SizableText>
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
        {title && (
          <Toast.Title fontWeight="600" size="$3">
            {title}
          </Toast.Title>
        )}
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
