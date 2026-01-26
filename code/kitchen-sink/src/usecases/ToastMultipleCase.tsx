/**
 * Demo case for new Toast API with multiple toasts, stacking, and all positions.
 */

import { Button, H4, XStack, YStack, Text, Separator } from 'tamagui'
import { toast, Toaster, type ToasterPosition } from '@tamagui/toast'
import * as React from 'react'

const positions: ToasterPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

export function ToastMultipleCase() {
  const [position, setPosition] = React.useState<ToasterPosition>('bottom-right')
  const [richColors, setRichColors] = React.useState(true)
  const [closeButton, setCloseButton] = React.useState(true)
  const [expand, setExpand] = React.useState(false)

  return (
    <YStack flex={1} gap="$4" padding="$4">
      <Toaster
        position={position}
        richColors={richColors}
        closeButton={closeButton}
        expand={expand}
        visibleToasts={4}
        gap={12}
      />

      <H4>Toast Demo - New v2 API</H4>

      {/* Position selector */}
      <YStack gap="$2">
        <Text fontWeight="600">Position</Text>
        <XStack flexWrap="wrap" gap="$2">
          {positions.map((pos) => (
            <Button
              key={pos}
              size="$2"
              theme={position === pos ? 'active' : undefined}
              onPress={() => setPosition(pos)}
            >
              {pos}
            </Button>
          ))}
        </XStack>
      </YStack>

      <Separator />

      {/* Options */}
      <XStack gap="$4" flexWrap="wrap">
        <Button
          size="$3"
          theme={richColors ? 'active' : undefined}
          onPress={() => setRichColors(!richColors)}
        >
          Rich Colors: {richColors ? 'On' : 'Off'}
        </Button>
        <Button
          size="$3"
          theme={closeButton ? 'active' : undefined}
          onPress={() => setCloseButton(!closeButton)}
        >
          Close Button: {closeButton ? 'On' : 'Off'}
        </Button>
        <Button
          size="$3"
          theme={expand ? 'active' : undefined}
          onPress={() => setExpand(!expand)}
        >
          Always Expand: {expand ? 'On' : 'Off'}
        </Button>
      </XStack>

      <Separator />

      {/* Toast types */}
      <YStack gap="$2">
        <Text fontWeight="600">Toast Types</Text>
        <XStack flexWrap="wrap" gap="$2">
          <Button
            size="$3"
            onPress={() => toast('This is a default toast')}
            testID="toast-default"
          >
            Default
          </Button>
          <Button
            size="$3"
            theme="green"
            onPress={() => toast.success('Operation completed successfully!')}
            testID="toast-success"
          >
            Success
          </Button>
          <Button
            size="$3"
            theme="red"
            onPress={() => toast.error('Something went wrong')}
            testID="toast-error"
          >
            Error
          </Button>
          <Button
            size="$3"
            theme="yellow"
            onPress={() => toast.warning('Please review before continuing')}
            testID="toast-warning"
          >
            Warning
          </Button>
          <Button
            size="$3"
            theme="blue"
            onPress={() => toast.info('Here is some information')}
            testID="toast-info"
          >
            Info
          </Button>
          <Button
            size="$3"
            onPress={() => toast.loading('Loading data...')}
            testID="toast-loading"
          >
            Loading
          </Button>
        </XStack>
      </YStack>

      <Separator />

      {/* With description */}
      <YStack gap="$2">
        <Text fontWeight="600">With Description</Text>
        <XStack flexWrap="wrap" gap="$2">
          <Button
            size="$3"
            onPress={() =>
              toast.success('File uploaded', {
                description: 'Your file has been uploaded to the cloud.',
              })
            }
            testID="toast-with-desc"
          >
            With Description
          </Button>
          <Button
            size="$3"
            onPress={() =>
              toast.error('Upload failed', {
                description: 'Please check your internet connection and try again.',
                duration: 10000,
              })
            }
          >
            Long Duration (10s)
          </Button>
        </XStack>
      </YStack>

      <Separator />

      {/* Promise toast */}
      <YStack gap="$2">
        <Text fontWeight="600">Promise Toast</Text>
        <XStack flexWrap="wrap" gap="$2">
          <Button
            size="$3"
            onPress={() => {
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 2000)),
                {
                  loading: 'Saving changes...',
                  success: 'Changes saved successfully!',
                  error: 'Failed to save changes',
                }
              )
            }}
            testID="toast-promise-success"
          >
            Promise (Success)
          </Button>
          <Button
            size="$3"
            onPress={() => {
              toast.promise(
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Network error')), 2000)
                ),
                {
                  loading: 'Connecting to server...',
                  success: 'Connected!',
                  error: (err) => `Failed: ${err.message}`,
                }
              )
            }}
            testID="toast-promise-error"
          >
            Promise (Error)
          </Button>
        </XStack>
      </YStack>

      <Separator />

      {/* Actions */}
      <YStack gap="$2">
        <Text fontWeight="600">With Actions</Text>
        <XStack flexWrap="wrap" gap="$2">
          <Button
            size="$3"
            onPress={() =>
              toast('New message received', {
                action: {
                  label: 'View',
                  onClick: () => console.log('View clicked'),
                },
              })
            }
            testID="toast-action"
          >
            With Action
          </Button>
          <Button
            size="$3"
            onPress={() =>
              toast('Are you sure?', {
                action: {
                  label: 'Confirm',
                  onClick: () => console.log('Confirmed'),
                },
                cancel: {
                  label: 'Cancel',
                  onClick: () => console.log('Cancelled'),
                },
              })
            }
          >
            With Action + Cancel
          </Button>
        </XStack>
      </YStack>

      <Separator />

      {/* Multiple toasts */}
      <YStack gap="$2">
        <Text fontWeight="600">Multiple Toasts</Text>
        <XStack flexWrap="wrap" gap="$2">
          <Button
            size="$3"
            onPress={() => {
              toast.success('First toast')
              setTimeout(() => toast.info('Second toast'), 200)
              setTimeout(() => toast.warning('Third toast'), 400)
              setTimeout(() => toast.error('Fourth toast'), 600)
            }}
            testID="toast-multiple"
          >
            Show 4 Toasts
          </Button>
          <Button
            size="$3"
            onPress={() => toast.dismiss()}
            testID="toast-dismiss-all"
          >
            Dismiss All
          </Button>
        </XStack>
      </YStack>

      <Separator />

      {/* Control */}
      <YStack gap="$2">
        <Text fontWeight="600">Manual Control</Text>
        <XStack flexWrap="wrap" gap="$2">
          <Button
            size="$3"
            onPress={() => {
              const id = toast.loading('Processing...')
              setTimeout(() => {
                toast.success('Done!', { id })
              }, 2000)
            }}
            testID="toast-update"
          >
            Update Toast
          </Button>
        </XStack>
      </YStack>
    </YStack>
  )
}
