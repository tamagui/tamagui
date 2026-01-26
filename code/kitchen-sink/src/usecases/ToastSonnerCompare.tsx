/**
 * Side-by-side comparison with Sonner-like styling
 */

import { Button, H4, XStack, YStack, Text, Separator } from 'tamagui'
import { toast, Toaster, type ToasterPosition } from '@tamagui/toast'
import * as React from 'react'

export function ToastSonnerCompare() {
  const [position, setPosition] = React.useState<ToasterPosition>('bottom-right')

  return (
    <YStack flex={1} gap="$4" padding="$4" backgroundColor="$background">
      <Toaster
        position={position}
        richColors
        closeButton
        visibleToasts={4}
        gap={14}
        offset={24}
      />

      <H4>Toast - Sonner Comparison</H4>

      <XStack gap="$2" flexWrap="wrap">
        <Button size="$3" onPress={() => setPosition('top-left')}>top-left</Button>
        <Button size="$3" onPress={() => setPosition('top-center')}>top-center</Button>
        <Button size="$3" onPress={() => setPosition('top-right')}>top-right</Button>
        <Button size="$3" onPress={() => setPosition('bottom-left')}>bottom-left</Button>
        <Button size="$3" onPress={() => setPosition('bottom-center')}>bottom-center</Button>
        <Button size="$3" onPress={() => setPosition('bottom-right')}>bottom-right</Button>
      </XStack>

      <Separator />

      <XStack gap="$2" flexWrap="wrap">
        <Button
          size="$3"
          testID="single-toast"
          onPress={() => toast('Event has been created')}
        >
          Single Toast
        </Button>

        <Button
          size="$3"
          testID="toast-with-desc"
          onPress={() => toast('Event has been created', {
            description: 'Monday, January 3rd at 6:00pm',
          })}
        >
          With Description
        </Button>

        <Button
          size="$3"
          theme="green"
          testID="success-toast"
          onPress={() => toast.success('Event has been created')}
        >
          Success
        </Button>

        <Button
          size="$3"
          theme="red"
          testID="error-toast"
          onPress={() => toast.error('Event has not been created')}
        >
          Error
        </Button>

        <Button
          size="$3"
          testID="stack-toasts"
          onPress={() => {
            toast('First notification')
            setTimeout(() => toast.success('Second notification'), 100)
            setTimeout(() => toast.error('Third notification'), 200)
            setTimeout(() => toast.info('Fourth notification'), 300)
          }}
        >
          Stack 4 Toasts
        </Button>

        <Button
          size="$3"
          testID="promise-toast"
          onPress={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: 'Loading...',
                success: 'Data loaded successfully',
                error: 'Error loading data',
              }
            )
          }}
        >
          Promise
        </Button>

        <Button
          size="$3"
          testID="dismiss-all"
          onPress={() => toast.dismiss()}
        >
          Dismiss All
        </Button>
      </XStack>
    </YStack>
  )
}
