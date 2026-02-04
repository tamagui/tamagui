/**
 * Demo case for new Toast API with composable components, multiple toasts, stacking, and all positions.
 */

import { Button, H4, XStack, YStack, Text, Separator, SizableText } from 'tamagui'
import { toast, Toast, useToasts, type ToastPosition } from '@tamagui/toast'
import * as React from 'react'

const positions: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

export function ToastMultipleCase() {
  const [position, setPosition] = React.useState<ToastPosition>('bottom-right')
  const [closeButton, setCloseButton] = React.useState(true)
  const [expand, setExpand] = React.useState(false)

  return (
    <Toast position={position} closeButton={closeButton} visibleToasts={4} gap={12}>
      <Toast.Viewport>
        <ToastList showCloseButton={closeButton} />
      </Toast.Viewport>

      <YStack flex={1} gap="$4" padding="$4">
        <H4>Toast Demo - Composable v2 API</H4>

      {/* Position selector */}
      <YStack gap="$2">
        <Text fontWeight="600">Position</Text>
        <XStack flexWrap="wrap" gap="$2">
          {positions.map((pos) => (
            <Button
              key={pos}
              size="$2"
              backgroundColor={position === pos ? '$color8' : undefined}
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
          backgroundColor={closeButton ? '$color8' : undefined}
          onPress={() => setCloseButton(!closeButton)}
        >
          Close Button: {closeButton ? 'On' : 'Off'}
        </Button>
        <Button
          size="$3"
          backgroundColor={expand ? '$color8' : undefined}
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
              toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                loading: 'Saving changes...',
                success: 'Changes saved successfully!',
                error: 'Failed to save changes',
              })
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
          <Button size="$3" onPress={() => toast.dismiss()} testID="toast-dismiss-all">
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
    </Toast>
  )
}

// composable toast list component
function ToastList({ showCloseButton }: { showCloseButton: boolean }) {
  const { toasts } = useToasts()

  return (
    <>
      {toasts.map((t, index) => (
        <Toast.Item key={t.id} toast={t} index={index}>
          {({ handleClose }) => (
            <XStack gap="$3" alignItems="flex-start">
              {/* icon based on type */}
              {t.type && t.type !== 'default' && (
                <ToastIcon type={t.type} />
              )}
              <YStack flex={1} gap="$1">
                <Toast.Title>
                  {typeof t.title === 'function' ? t.title() : t.title}
                </Toast.Title>
                {t.description && (
                  <Toast.Description>
                    {typeof t.description === 'function' ? t.description() : t.description}
                  </Toast.Description>
                )}
                {/* actions */}
                {(t.action || t.cancel) && (
                  <XStack gap="$2" marginTop="$2">
                    {t.action && (
                      <Toast.Action
                        onPress={(e: any) => {
                          t.action?.onClick?.(e)
                          handleClose()
                        }}
                      >
                        <SizableText size="$1" fontWeight="600">
                          {t.action.label}
                        </SizableText>
                      </Toast.Action>
                    )}
                    {t.cancel && (
                      <Toast.Action
                        backgroundColor="transparent"
                        onPress={(e: any) => {
                          t.cancel?.onClick?.(e)
                          handleClose()
                        }}
                      >
                        <SizableText size="$1" color="$color11">
                          {t.cancel.label}
                        </SizableText>
                      </Toast.Action>
                    )}
                  </XStack>
                )}
              </YStack>
              {showCloseButton && <Toast.Close onPress={handleClose} />}
            </XStack>
          )}
        </Toast.Item>
      ))}
    </>
  )
}

function ToastIcon({ type }: { type: string }) {
  const iconMap: Record<string, { icon: string; color: string }> = {
    success: { icon: '✓', color: '$green10' },
    error: { icon: '✕', color: '$red10' },
    warning: { icon: '⚠', color: '$yellow10' },
    info: { icon: 'ℹ', color: '$blue10' },
    loading: { icon: '◌', color: '$color11' },
  }
  const { icon, color } = iconMap[type] || { icon: '', color: '$color' }
  return (
    <SizableText size="$4" color={color as any}>
      {icon}
    </SizableText>
  )
}
