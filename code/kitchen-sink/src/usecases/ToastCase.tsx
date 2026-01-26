import { toast, Toaster } from '@tamagui/toast'
import React from 'react'
import { Button, YStack } from 'tamagui'

export function ToastCase() {
  return (
    <YStack gap="$4" alignItems="center">
      <Toaster />
      <Button
        data-testid="button-add-toast"
        onPress={() => {
          toast('Toast title', {
            description: 'Toast description',
            action: { label: 'Action', onClick: () => {} },
          })
        }}
      >
        Add toast
      </Button>
      <Button data-testid="button-before">Focusable before</Button>
      <Button data-testid="button-after">Focusable after</Button>
    </YStack>
  )
}
