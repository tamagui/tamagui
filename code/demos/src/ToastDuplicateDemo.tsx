import { toast, Toaster } from '@tamagui/toast'
import React from 'react'
import { Button, YStack } from 'tamagui'

export const ToastDuplicateDemo = () => {
  return (
    <YStack items="center" gap="$4">
      <Toaster />
      <Button
        onPress={() => {
          toast.success('Successfully saved!', {
            description: "Don't worry... We've got your data.",
          })
        }}
      >
        Show toast
      </Button>
    </YStack>
  )
}
