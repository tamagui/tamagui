import { CheckCircle2 } from '@tamagui/lucide-icons-2'
import { toast, useToasts } from '@tamagui/toast'
import { Button, Toast, XStack, YStack } from 'tamagui'

/**
 *  IMPORTANT NOTE: if you're copy-pasting this demo into your code, make sure to add the Toast wrapper as well.
 */
export const ToastDuplicateDemo = () => {
  return (
    <Toast toasterId="duplicate-demo">
      <Toast.Viewport>
        <ToastList />
      </Toast.Viewport>

      <YStack items="center">
        <Button
          onPress={() => {
            toast('Successfully saved!', {
              toasterId: 'duplicate-demo',
              description: "Don't worry... We've got your data.",
            })
          }}
        >
          Show toast
        </Button>
      </YStack>
    </Toast>
  )
}

const ToastList = () => {
  const { toasts } = useToasts()

  return (
    <>
      {toasts.map((t, index) => (
        <Toast.Item key={t.id} toast={t} index={index}>
          <XStack gap="4" items="center">
            <YStack>
              <CheckCircle2 />
            </YStack>

            <YStack>
              <Toast.Title>
                {typeof t.title === 'function' ? t.title() : t.title}
              </Toast.Title>
              {t.description && (
                <Toast.Description>
                  {typeof t.description === 'function' ? t.description() : t.description}
                </Toast.Description>
              )}
            </YStack>
          </XStack>
        </Toast.Item>
      ))}
    </>
  )
}
