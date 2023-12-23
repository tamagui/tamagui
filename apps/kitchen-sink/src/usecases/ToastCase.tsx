import { Toast, ToastProvider, ToastViewport } from '@tamagui/toast'
import React from 'react'
import { Button, YStack } from 'tamagui'

export function ToastCase() {
  const [count, setCount] = React.useState(0)

  return (
    <ToastProvider>
      <Button
        data-testid="button-add-toast"
        onPress={() => setCount((count) => count + 1)}
      >
        Add toast
      </Button>
      <YStack maxWidth={700} margin={'auto'}>
        <Button data-testid="button-before">Focusable before viewport</Button>

        {[...Array(count)].map((_, index) => {
          const identifier = index + 1
          return (
            <Toast key={index} open data-testid={`toast-${identifier}`}>
              <Toast.Title>Toast {identifier} title</Toast.Title>
              <Toast.Description>Toast {identifier} description</Toast.Description>

              <Toast.Close aria-label="Close" asChild>
                <Button
                  data-testid={`toast-button-${identifier}.1`}
                >{`Toast button ${identifier}.1`}</Button>
              </Toast.Close>
              <Toast.Action altText="Go and perform an action" mt="$2" asChild>
                <Button
                  data-testid={`toast-button-${identifier}.2`}
                >{`Toast button ${identifier}.2`}</Button>
              </Toast.Action>
            </Toast>
          )
        })}

        <ToastViewport />

        <Button data-testid="button-after">Focusable after viewport</Button>
      </YStack>
    </ToastProvider>
  )
}
