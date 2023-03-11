import { CheckCircle2 } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Toast, XStack, YStack } from 'tamagui'

export const ToastDemo = () => {
  const [savedCount, setSavedCount] = React.useState(0)

  return (
    <YStack ai="center">
      <Button
        onPress={() => {
          setSavedCount((old) => old + 1)
        }}
      >
        Show toast
      </Button>
      {[...Array(savedCount)].map((_, index) => (
        <Toast
          key={index}
          duration={4000}
          enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
          exitStyle={{ opacity: 0, scale: 1, y: -20 }}
          y={0}
          opacity={1}
          scale={1}
          animation="100ms"
        >
          <XStack space ai="center">
            <YStack
              animation="quick"
              enterStyle={{ scale: 0, rotate: '-100deg', x: 10 }}
              x={0}
              scale={1}
              rotate="0deg"
            >
              <CheckCircle2 />
            </YStack>

            <YStack>
              <Toast.Title enterStyle={{ x: 40 }} x={0} animation="quick">
                Successfully saved!
              </Toast.Title>
              <Toast.Description enterStyle={{ x: 20 }} x={0} animation="quick">
                Don't worry... We've got your data.
              </Toast.Description>
            </YStack>
          </XStack>
        </Toast>
      ))}
    </YStack>
  )
}
