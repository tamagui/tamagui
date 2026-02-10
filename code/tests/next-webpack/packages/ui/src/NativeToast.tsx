import { Toast, useToasts } from '@tamagui/toast'
import { XStack, YStack } from 'tamagui'

export const NativeToast = () => {
  return (
    <Toast>
      <Toast.Viewport>
        <ToastList />
      </Toast.Viewport>
    </Toast>
  )
}

const ToastList = () => {
  const { toasts } = useToasts()

  return (
    <>
      {toasts.map((t, index) => (
        <Toast.Item key={t.id} toast={t} index={index}>
          <XStack gap="$3" items="flex-start">
            <YStack flex={1} gap="$1" py="$1.5" px="$2">
              <Toast.Title lineHeight="$1">
                {typeof t.title === 'function' ? t.title() : t.title}
              </Toast.Title>
              {t.description && (
                <Toast.Description>
                  {typeof t.description === 'function' ? t.description() : t.description}
                </Toast.Description>
              )}
            </YStack>
            <Toast.Close />
          </XStack>
        </Toast.Item>
      ))}
    </>
  )
}
