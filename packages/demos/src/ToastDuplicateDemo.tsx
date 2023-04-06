import { CheckCircle2 } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Toast, XStack, YStack } from 'tamagui'

export const ToastDuplicateDemo = () => {
  const [savedCount, setSavedCount] = React.useState(0)

  return (
    <YStack alignItems="center">
      <Button
        onPress={() => {
          setSavedCount((old) => old + 1)
        }}
      >
        Show toast
      </Button>
      {[...Array(savedCount)].map((_, index) => (
        <Toast
          viewportName="viewport-multiple" // Sends to a viewport that supports multiple toasts with the `multipleToasts` prop
          key={index}
          duration={4000}
          enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
          exitStyle={{ opacity: 0, scale: 1, y: -20 }}
          y={0}
          opacity={1}
          scale={1}
          animation="100ms"
        >
          <XStack space alignItems="center">
            <YStack>
              <CheckCircle2 />
            </YStack>

            <YStack>
              <Toast.Title>Successfully saved!</Toast.Title>
              <Toast.Description>Don't worry... We've got your data.</Toast.Description>
            </YStack>
          </XStack>
        </Toast>
      ))}
    </YStack>
  )
}
