import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Toast, ToastProvider, XStack, YStack, createToast } from 'tamagui'

const { ImperativeToastProvider, useToast } = createToast()

export const ToastDemo = () => {
  return (
    <YStack space>
      <ImperativeToastProvider>
        <ImperativeDemo />
      </ImperativeToastProvider>
      <DeclarativeDemo />
    </YStack>
  )
}

const ImperativeDemo = () => {
  const { show, currentToast } = useToast()

  return (
    <YStack>
      <YStack space>
        <Button
          onPress={() => {
            show('Saved successfully!', {
              message: 'Data saved successfully!',
              native: true,
            })
          }}
        >
          Imperative Native
        </Button>
        <Button
          onPress={() => {
            show('Saved successfully!', { message: 'Data saved successfully!' })
          }}
        >
          Imperative
        </Button>
      </YStack>

      {/* non-native only: */}
      {!!currentToast && (
        <Toast
          key={currentToast.id}
          animation="100ms"
          enterStyle={{ opacity: 0, scale: 0.6, y: -25 }}
          exitStyle={{ opacity: 0, scale: 1, y: -20 }}
          y={0}
          opacity={1}
          scale={1}
        >
          <Toast.Title>{currentToast.title}</Toast.Title>
          <Toast.Description>{currentToast.message}</Toast.Description>
        </Toast>
      )}
    </YStack>
  )
}
const DeclarativeDemo = () => {
  return (
    <XStack space ai="center" jc="center">
      <YStack space>
        <XStack space jc="center">
          <DeclarativeMultipleToastDemo name="top-left" />
          <DeclarativeMultipleToastDemo name="top-center" />
          <DeclarativeMultipleToastDemo name="top-right" />
        </XStack>
        <XStack space jc="center">
          <DeclarativeMultipleToastDemo name="bottom-left" />
          <DeclarativeMultipleToastDemo name="bottom-center" />
          <DeclarativeMultipleToastDemo name="bottom-right" />
        </XStack>
      </YStack>
    </XStack>
  )
}

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
      <Toast.Viewport flexDirection="column-reverse" name="top-left" top="$2" left="$2" />
      <Toast.Viewport
        flexDirection="column-reverse"
        name="top-center"
        top="$2"
        left="$2"
        right="$2"
        mx="auto"
      />
      <Toast.Viewport
        flexDirection="column-reverse"
        name="top-right"
        top="$2"
        right="$2"
      />
      <Toast.Viewport name="bottom-left" bottom="$2" left="$2" />
      <Toast.Viewport name="bottom-center" bottom="$2" left="$2" right="$2" mx="auto" />
      <Toast.Viewport name="bottom-right" bottom="$2" right="$2" />
    </ToastProvider>
  )
}

export function DeclarativeMultipleToastDemo({ name }: { name?: string }) {
  const [savedCount, setSavedCount] = React.useState(0)

  return (
    <YStack ai="center">
      <Button
        onPress={() => {
          setSavedCount((old) => old + 1)
        }}
      >
        Declarative {name}
      </Button>

      {[...Array(savedCount)].map((_, index) => (
        <Toast
          viewportName={name}
          key={index}
          enterStyle={{ opacity: 0, scale: 0.6, y: -25 }}
          exitStyle={{ opacity: 0, scale: 1, y: -20 }}
          y={0}
          opacity={1}
          scale={1}
          animation="100ms"
        >
          <XStack space ai="center">
            <Check />

            <YStack>
              <Toast.Title>Successfully saved!</Toast.Title>
              <Toast.Description>We've got your data. Toast #{index}</Toast.Description>
            </YStack>
          </XStack>
        </Toast>
      ))}
    </YStack>
  )
}

const DeclarativeSingleToastDemo = ({ name }: { name?: string }) => {
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
        enterStyle={{ opacity: 0, scale: 0.6, y: -25 }}
        exitStyle={{ opacity: 0, scale: 1, y: -20 }}
        y={0}
        opacity={1}
        scale={1}
        animation="100ms"
      >
        <XStack space ai="center">
          <Check />

          <YStack>
            <Toast.Title>Subscribed!</Toast.Title>
            <Toast.Description>We'll be in touch.</Toast.Description>
          </YStack>
        </XStack>
      </Toast>
    </YStack>
  )
}
