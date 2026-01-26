import { toast, Toaster, type ToasterPosition } from '@tamagui/toast'
import { Circle } from '@tamagui/lucide-icons'
import * as React from 'react'
import { Button, XStack, YStack } from 'tamagui'

// put this at the root of your app:
export const ToastRoot = () => <Toaster />

export function ToastDemo() {
  const [position, setPosition] = React.useState<ToasterPosition>('bottom-right')

  return (
    <XStack gap="$4" alignItems="center" userSelect="none">
      <Toaster position={position} closeButton />

      <XStack gap="$2" flexWrap="wrap">
        <Button size="$3" onPress={() => toast('Event created')}>
          Default
        </Button>
        <Button size="$3" theme="green" onPress={() => toast.success('Saved!')}>
          Success
        </Button>
        <Button size="$3" theme="red" onPress={() => toast.error('Failed')}>
          Error
        </Button>
        <Button
          size="$3"
          onPress={() =>
            toast('Deleted', {
              action: { label: 'Undo', onClick: () => toast('Restored') },
            })
          }
        >
          Action
        </Button>
      </XStack>

      {/* Position Grid */}
      <YStack gap="$1">
        <XStack gap="$1">
          <PosBtn pos="top-left" current={position} set={setPosition} />
          <PosBtn pos="top-center" current={position} set={setPosition} />
          <PosBtn pos="top-right" current={position} set={setPosition} />
        </XStack>
        <XStack gap="$1">
          <PosBtn pos="bottom-left" current={position} set={setPosition} />
          <PosBtn pos="bottom-center" current={position} set={setPosition} />
          <PosBtn pos="bottom-right" current={position} set={setPosition} />
        </XStack>
      </YStack>
    </XStack>
  )
}

function PosBtn({
  pos,
  current,
  set,
}: {
  pos: ToasterPosition
  current: ToasterPosition
  set: (p: ToasterPosition) => void
}) {
  return (
    <Button
      size="$2"
      circular
      icon={Circle}
      theme={pos === current ? 'blue' : undefined}
      onPress={() => set(pos)}
      aria-label={pos}
    />
  )
}
