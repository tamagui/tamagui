import { toast, Toaster, type ToasterPosition } from '@tamagui/toast'
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
} from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

export const ToastDemo = () => {
  const [position, setPosition] = useState<ToasterPosition>('bottom-right')
  const count = useRef(0)

  const showToast = (newPosition: ToasterPosition) => {
    setPosition(newPosition)
    count.current++
    toast(`Toast #${count.current}`)
  }

  return (
    <Theme name="surface2">
      <Toaster position={position} />

      <YStack gap="$2" self="center">
        <XStack gap="$2">
          <PositionButton
            position="top-left"
            current={position}
            onPress={showToast}
            Icon={ArrowUpLeft}
          />
          <PositionButton
            position="top-center"
            current={position}
            onPress={showToast}
            Icon={ArrowUp}
          />
          <PositionButton
            position="top-right"
            current={position}
            onPress={showToast}
            Icon={ArrowUpRight}
          />
        </XStack>
        <XStack gap="$2">
          <PositionButton
            position="bottom-left"
            current={position}
            onPress={showToast}
            Icon={ArrowDownLeft}
          />
          <PositionButton
            position="bottom-center"
            current={position}
            onPress={showToast}
            Icon={ArrowDown}
          />
          <PositionButton
            position="bottom-right"
            current={position}
            onPress={showToast}
            Icon={ArrowDownRight}
          />
        </XStack>
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
