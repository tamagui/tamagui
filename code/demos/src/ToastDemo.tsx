import { Toast, useToastController, useToastState } from '@tamagui/toast'
import React from 'react'
import { Button, Label, Switch, XStack, YStack } from 'tamagui'

/**
 *  IMPORTANT NOTE: if you're copy-pasting this demo into your code, make sure to add:
 *    - <ToastProvider> at the root
 *    - <ToastViewport /> where you want to show the toasts
 */
export const ToastDemo = () => {
  const [native, setNative] = React.useState(false)

  return (
    <YStack gap="$4" items="center">
      <ToastControl native={native} />
      <CurrentToast />

      <NativeOptions native={native} setNative={setNative} />
    </YStack>
  )
}

const CurrentToast = () => {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.95, y: -80 }}
      exitStyle={{ opacity: 0, scale: 0.95, y: -80 }}
      opacity={1}
      scale={1}
      y={-50}
      transition="quicker"
      bg="$color2"
      boxShadow="0px 2px 4px rgba(0,0,0,0.12), 0px 8px 24px rgba(0,0,0,0.08)"
    >
      <XStack gap="$5" items="center" justify="space-between">
        <YStack gap="$0.5" flex={1}>
          <Toast.Title>{currentToast.title}</Toast.Title>
          {!!currentToast.message && (
            <Toast.Description>{currentToast.message}</Toast.Description>
          )}
        </YStack>
        <Toast.Action asChild altText="Dismiss toast">
          <Button theme="surface3" size="$2">
            Dismiss
          </Button>
        </Toast.Action>
      </XStack>
    </Toast>
  )
}

const ToastControl = ({ native }: { native: boolean }) => {
  const toast = useToastController()

  return (
    <XStack gap="$2" justify="center">
      <Button
        theme="surface3"
        onPress={() => {
          toast.show('Successfully saved!', {
            message: "Don't worry, we've got your data.",
            native,
            demo: true,
          })
        }}
      >
        Show
      </Button>
      <Button
        theme="surface3"
        onPress={() => {
          toast.hide()
        }}
      >
        Hide
      </Button>
    </XStack>
  )
}

const NativeOptions = ({
  native,
  setNative,
}: {
  native: boolean
  setNative: (native: boolean) => void
}) => {
  return (
    <XStack gap="$3">
      <Label size="$1" onPress={() => setNative(false)}>
        Custom
      </Label>
      <Switch
        theme="surface2"
        id="native-toggle"
        size="$1"
        checked={!!native}
        onCheckedChange={(val) => setNative(val)}
      >
        <Switch.Thumb
          theme="accent"
          transition={[
            'quickest',
            {
              transform: {
                overshootClamping: true,
              },
            },
          ]}
        />
      </Switch>

      <Label size="$1" onPress={() => setNative(true)}>
        Native
      </Label>
    </XStack>
  )
}
