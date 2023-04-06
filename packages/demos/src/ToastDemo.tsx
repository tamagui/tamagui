import React from 'react'
import { Button, SizableText, Switch, Toast, XStack, YStack, useToast } from 'tamagui'

export const ToastDemo = () => {
  const [native, setNative] = React.useState<boolean>(false)

  return (
    <YStack space alignItems="center">
      <ToastControl native={native} />
      <CurrentToast />

      <NativeOptions native={native} setNative={setNative} />
    </YStack>
  )
}

const CurrentToast = () => {
  const { currentToast } = useToast()

  if (!currentToast || currentToast.isHandledNatively) return null
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="100ms"
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}

const ToastControl = ({ native }: { native: boolean }) => {
  const toast = useToast()
  return (
    <XStack space="$2" justifyContent="center">
      <Button
        onPress={() => {
          toast.show('Successfully saved!', {
            message: "Don't worry, we've got your data.",
            native,
          })
        }}
      >
        Show
      </Button>
      <Button
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
    <XStack space="$3">
      <SizableText size="$1">Custom</SizableText>

      <Switch
        theme="active"
        size="$1"
        checked={!!native}
        onCheckedChange={(val) => setNative(val)}
      >
        <Switch.Thumb
          animation={[
            'quick',
            {
              transform: {
                overshootClamping: true,
              },
            },
          ]}
        />
      </Switch>

      <SizableText size="$1">Native</SizableText>
    </XStack>
  )
}
