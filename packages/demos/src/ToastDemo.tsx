import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Theme, Toast, ToastProvider, XStack, YStack, isWeb } from 'tamagui'

export const ToastDemo = () => {
  return (
    <YStack space ai="center" jc="center">
      <ToastProvider swipeDirection="left" duration={2000}>
        <Theme name="red">
          <Toast.Viewport
            position={isWeb ? ('fixed' as any) : 'absolute'}
            left='50%'
            top={10}
            mx='auto'
          />
        </Theme>
        <SingleToastExample />
        <MultipleToastExample />
      </ToastProvider>
    </YStack>
  )
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
          }, 100) // should be more than the animation's duration
        }}
      >
        Single Toast
      </Button>
      <Toast
        onOpenChange={setOpen}
        open={open}
        enterStyle={{ y: -20, opacity: 0 }}
        exitStyle={{ y: -20, opacity: 0 }}
        animation="100ms"
        o={1}
        y={0}
        br="$10"
        px="$5"
        py="$2"
        theme="red"
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
          enterStyle={{ y: -20, opacity: 0 }}
          exitStyle={{ y: -20, opacity: 0 }}
          animation="100ms"
          o={1}
          y={0}
          br="$10"
          px="$5"
          py="$2"
          my="$1"
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
