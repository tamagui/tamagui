import { toast, Toaster, type ToasterPosition } from '@tamagui/toast'
import { ChevronDown, ChevronUp, Circle, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

// Add <Toaster /> to your app root:
// <Toaster position="bottom-right" />

export const ToastDemo = () => {
  const [position, setPosition] = useState<ToasterPosition>('bottom-right')

  return (
    <Theme name="surface2">
      <Toaster position={position} />

      <YStack gap="$3" self="center">
        {/* Toast types */}
        <XStack gap="$2" justify="center">
          <Button size="$3" onPress={() => toast('Default')}>
            Default
          </Button>
          <Button size="$3" theme="green" onPress={() => toast.success('Success!')}>
            Success
          </Button>
          <Button size="$3" theme="red" onPress={() => toast.error('Error')}>
            Error
          </Button>
          <Button size="$3" theme="yellow" onPress={() => toast.warning('Warning')}>
            Warning
          </Button>
          <Button size="$3" icon={X} onPress={() => toast.dismiss()} />
        </XStack>

        {/* Position grid */}
        <YStack gap="$2" self="center">
          <XStack gap="$2">
            <PositionButton position="top-left" current={position} onPress={setPosition} Icon={Circle} />
            <PositionButton position="top-center" current={position} onPress={setPosition} Icon={ChevronUp} />
            <PositionButton position="top-right" current={position} onPress={setPosition} Icon={Circle} />
          </XStack>
          <XStack gap="$2">
            <PositionButton position="bottom-left" current={position} onPress={setPosition} Icon={Circle} />
            <PositionButton position="bottom-center" current={position} onPress={setPosition} Icon={ChevronDown} />
            <PositionButton position="bottom-right" current={position} onPress={setPosition} Icon={Circle} />
          </XStack>
        </YStack>
      </YStack>
    </Theme>
  )
}

function PositionButton({
  position,
  current,
  onPress,
  Icon,
}: {
  position: ToasterPosition
  current: ToasterPosition
  onPress: (p: ToasterPosition) => void
  Icon: any
}) {
  const isActive = position === current

  return (
    <Button
      icon={Icon}
      circular
      backgroundColor={isActive ? '$color8' : undefined}
      onPress={() => onPress(position)}
    />
  )
}
