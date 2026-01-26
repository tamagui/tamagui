import { toast, Toaster, type ToasterPosition } from '@tamagui/toast'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
} from '@tamagui/lucide-icons'
import * as React from 'react'
import { Button, XStack, YStack } from 'tamagui'

export function ToastDemo() {
  const [position, setPosition] = React.useState<ToasterPosition>('bottom-right')

  return (
    <YStack gap="$4" padding="$4" alignItems="center">
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
      <YStack gap="$2">
        <XStack gap="$2">
          <PosBtn
            pos="top-left"
            current={position}
            set={setPosition}
            Icon={Circle}
          />
          <PosBtn
            pos="top-center"
            current={position}
            set={setPosition}
            Icon={ChevronUp}
          />
          <PosBtn
            pos="top-right"
            current={position}
            set={setPosition}
            Icon={Circle}
          />
        </XStack>
        <XStack gap="$2">
          <PosBtn
            pos="bottom-left"
            current={position}
            set={setPosition}
            Icon={Circle}
          />
          <PosBtn
            pos="bottom-center"
            current={position}
            set={setPosition}
            Icon={ChevronDown}
          />
          <PosBtn
            pos="bottom-right"
            current={position}
            set={setPosition}
            Icon={Circle}
          />
        </XStack>
      </YStack>
    </YStack>
  )
}

function PosBtn({
  pos,
  current,
  set,
  Icon,
}: {
  pos: ToasterPosition
  current: ToasterPosition
  set: (p: ToasterPosition) => void
  Icon: any
}) {
  return (
    <Button
      circular
      icon={Icon}
      theme={pos === current ? 'active' : 'surface3'}
      onPress={() => set(pos)}
      aria-label={pos}
    />
  )
}
