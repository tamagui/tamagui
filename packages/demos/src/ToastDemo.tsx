import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import {
  Button,
  PortalHost,
  Toast,
  ToastProvider,
  Unspaced,
  XStack,
  YStack,
  isWeb,
} from 'tamagui'

export const ToastDemo = () => {
  // <ToastProvider swipeDirection="left" duration={5000}>
  //   {isWeb && <Toast.Viewport />}
  return (
    <YStack space ai="center" jc="center">
      <SingleToastExample />
      <MultipleToastExample />
    </YStack>
  )
  // </ToastProvider>
}

const SingleToastExample = () => {
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef(0)

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <YStack ai="center">
      <Button
        onPress={() => {
          setOpen(false)
          window.clearTimeout(timerRef.current)
          timerRef.current = window.setTimeout(() => {
            setOpen(true)
          }, 150) // should be more than the animation's duration - give it a bit more on non-css animation drivers
        }}
      >
        Single Toast
      </Button>
      <Toast
        onOpenChange={setOpen}
        open={open}
        enterStyle={{ x: -20, opacity: 0 }}
        exitStyle={{ x: -20, opacity: 0 }}
        animation="100ms"
        o={1}
        x={0}
        br="$10"
        px="$5"
        py="$2"
        my="$1"
        mx="auto"
      >
        <XStack space ai="center">
          <Check />

          <YStack>
            <Toast.Title size="$4">Subscribed!</Toast.Title>
            <Toast.Description size="$1">We'll be in touch.</Toast.Description>
          </YStack>
        </XStack>
      </Toast>
    </YStack>
  )
}

export function MultipleToastExample() {
  const [savedCount, setSavedCount] = React.useState(0)

  return (
    <YStack ai="center">
      <Button
        onPress={() => {
          setSavedCount((old) => old + 1)
        }}
      >
        Stackable Toast
      </Button>
      {[...Array(savedCount)].map((_, index) => (
        <Toast
          key={index}
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          animation="100ms"
          o={1}
          x={0}
          br="$10"
          px="$5"
          py="$2"
          my="$1"
          mx="auto"
        >
          <XStack space ai="center">
            <Check />

            <YStack>
              <Toast.Title size="$4">Successfully saved!</Toast.Title>
              <Toast.Description size="$1">We've got your data.</Toast.Description>
            </YStack>
          </XStack>
        </Toast>
      ))}
    </YStack>
  )
}
