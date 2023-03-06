import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Toast, ToastProvider, XStack, YStack } from 'tamagui'

// App is wrapped inside this provider
const MyToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      {children}

      <Toast.Viewport
        flexDirection="column-reverse"
        name="default"
        top="$2"
        left="$2"
        right="$2"
        mx="auto"
      />
      <Toast.Viewport flexDirection="column-reverse" name="topleft" top="$2" left="$2" />
      <Toast.Viewport
        flexDirection="column-reverse"
        name="top"
        top="$2"
        left="$2"
        right="$2"
        mx="auto"
      />
      <Toast.Viewport
        flexDirection="column-reverse"
        name="topright"
        top="$2"
        right="$2"
      />
      <Toast.Viewport name="bottomleft" bottom="$2" left="$2" />
      <Toast.Viewport name="bottom" bottom="$2" left="$2" right="$2" mx="auto" />
      <Toast.Viewport name="bottomright" bottom="$2" right="$2" />
    </ToastProvider>
  )
}

export const ToastDemo = () => {
  return (
    <XStack space ai="center" jc="center">
      <YStack space>
        <XStack space jc="center">
          <MultipleToastExample name="topleft" />
          <MultipleToastExample name="top" />
          <MultipleToastExample name="topright" />
        </XStack>
        <XStack space jc="center">
          <MultipleToastExample name="bottomleft" />
          <MultipleToastExample name="bottom" />
          <MultipleToastExample name="bottomright" />
        </XStack>
      </YStack>
    </XStack>
  )
}

export function MultipleToastExample({ name }: { name?: string }) {
  const [savedCount, setSavedCount] = React.useState(0)

  return (
    <YStack ai="center">
      <Button
        onPress={() => {
          setSavedCount((old) => old + 1)
        }}
      >
        {name}
      </Button>

      {[...Array(savedCount)].map((_, index) => (
        <Toast
          viewportName={name}
          key={index}
          enterStyle={{ scale: 0.9, opacity: 0 }}
          exitStyle={{ scale: 0.9, opacity: 0 }}
          animation="100ms"
          opacity={1}
          scale={1}
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
              <Toast.Description size="$1">
                We've got your data. Toast #{index}
              </Toast.Description>
            </YStack>
          </XStack>
        </Toast>
      ))}
    </YStack>
  )
}

const SingleToastExample = ({ name }: { name?: string }) => {
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
        {name}
      </Button>

      <Toast
        viewportName={name}
        onOpenChange={setOpen}
        open={open}
        enterStyle={{ scale: 0.9, opacity: 0 }}
        exitStyle={{ scale: 0.9, opacity: 0 }}
        animation="100ms"
        opacity={1}
        scale={1}
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
