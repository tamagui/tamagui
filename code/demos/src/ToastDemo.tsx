import { toast, Toaster } from '@tamagui/toast'
import { Button, XStack, YStack } from 'tamagui'

export const ToastDemo = () => {
  return (
    <YStack gap="$4" items="center">
      <Toaster />

      <XStack gap="$2" flexWrap="wrap" justify="center">
        <Button size="$3" onPress={() => toast('Hello world!')}>
          Default
        </Button>
        <Button
          size="$3"
          theme="green"
          onPress={() => toast.success('Operation completed!')}
        >
          Success
        </Button>
        <Button size="$3" theme="red" onPress={() => toast.error('Something went wrong')}>
          Error
        </Button>
        <Button
          size="$3"
          theme="yellow"
          onPress={() => toast.warning('Please review')}
        >
          Warning
        </Button>
      </XStack>

      <XStack gap="$2" flexWrap="wrap" justify="center">
        <Button
          size="$3"
          onPress={() =>
            toast.success('File uploaded', {
              description: 'Your file has been saved to the cloud.',
            })
          }
        >
          With Description
        </Button>
        <Button
          size="$3"
          onPress={() =>
            toast('New message', {
              action: {
                label: 'View',
                onClick: () => console.log('View clicked'),
              },
            })
          }
        >
          With Action
        </Button>
      </XStack>

      <XStack gap="$2" justify="center">
        <Button
          size="$3"
          onPress={() => {
            toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
              loading: 'Saving...',
              success: 'Saved!',
              error: 'Failed to save',
            })
          }}
        >
          Promise Toast
        </Button>
        <Button size="$3" onPress={() => toast.dismiss()}>
          Dismiss All
        </Button>
      </XStack>
    </YStack>
  )
}
