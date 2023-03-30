import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import {
  Button,
  Checkbox,
  Label,
  Toast,
  ToastImperativeProvider,
  ToastNativePlatform,
  XStack,
  YStack,
  useToast,
} from 'tamagui'

export const ToastDemo = () => {
  const [native, setNative] = React.useState<ToastNativePlatform[]>([])

  return (
    <YStack space="$5">
      <ToastImperativeProvider options={{ native }}>
        <ToastControl />
        <CurrentToast />
      </ToastImperativeProvider>

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

const ToastControl = () => {
  const toast = useToast()
  return (
    <XStack space="$2" jc="center">
      <Button
        onPress={() => {
          toast.show('Successfully saved!', {
            message: "Don't worry, we've got your data.",
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
  native: ToastNativePlatform[]
  setNative: (native: ToastNativePlatform[]) => void
}) => {
  const supportedNativePlatforms: ToastNativePlatform[] = ['web', 'mobile']

  return (
    <XStack space>
      {supportedNativePlatforms.map((platform) => (
        <XStack ai="center" space="$2" key={platform}>
          <Checkbox
            id={platform}
            checked={native?.includes(platform)}
            onCheckedChange={(checked) => {
              if (checked) setNative([...native, platform])
              else setNative(native.filter((val) => val !== platform))
            }}
            size="$3"
          >
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
          <Label size="$3" htmlFor={platform}>
            Native {platform} toast
          </Label>
        </XStack>
      ))}
    </XStack>
  )
}
