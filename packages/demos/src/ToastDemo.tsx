import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Toast, ToastProvider, XStack, YStack, createToast } from 'tamagui'

const { ImperativeToastProvider, useToasts } = createToast({ native: false })

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
  const { toasts, show } = useToasts()

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

      {/* non native only: */}
      {toasts.map((toast, idx) => (
        <Toast
          key={idx}
          animation="100ms"
          enterStyle={{ o: 0, scale: 0.9 }}
          exitStyle={{ o: 0, scale: 0.9 }}
          o={1}
          scale={1}
        >
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.options.message}</Toast.Description>
        </Toast>
      ))}
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
          enterStyle={{ scale: 0.9, opacity: 0 }}
          exitStyle={{ scale: 0.9, opacity: 0 }}
          animation="100ms"
          opacity={1}
          scale={1}
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
        enterStyle={{ scale: 0.9, opacity: 0 }}
        exitStyle={{ scale: 0.9, opacity: 0 }}
        animation="100ms"
        opacity={1}
        scale={1}
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
