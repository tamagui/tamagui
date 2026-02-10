import { Toast, toast, useToasts, type ToastPosition } from '@tamagui/toast'
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
} from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'
import { Button, XStack, YStack } from 'tamagui'

export const ToastDemo = () => {
  const [position, setPosition] = useState<ToastPosition>('bottom-right')
  const count = useRef(0)

  const showToast = (newPosition: ToastPosition) => {
    setPosition(newPosition)
    count.current++
    toast(`Toast #${count.current}`, {
      description: 'Swipe to dismiss or wait for auto-close.',
    })
  }

  return (
    <Toast position={position}>
      <Toast.Viewport>
        <ToastList />
      </Toast.Viewport>

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
            testID="toast-show-button"
          />
        </XStack>
      </YStack>
    </Toast>
  )
}

const ToastList = () => {
  const { toasts } = useToasts()

  return (
    <>
      {toasts.map((t, index) => (
        <Toast.Item key={t.id} toast={t} index={index} testID="toast-item">
          <XStack gap="$3" alignItems="flex-start">
            <YStack flex={1} gap="$1">
              <Toast.Title>
                {typeof t.title === 'function' ? t.title() : t.title}
              </Toast.Title>
              {t.description && (
                <Toast.Description>
                  {typeof t.description === 'function' ? t.description() : t.description}
                </Toast.Description>
              )}
            </YStack>
            <Toast.Close testID="toast-close-button" />
          </XStack>
        </Toast.Item>
      ))}
    </>
  )
}

const PositionButton = ({
  position,
  current,
  onPress,
  Icon,
  testID,
}: {
  position: ToastPosition
  current: ToastPosition
  onPress: (p: ToastPosition) => void
  Icon: any
  testID?: string
}) => {
  const isActive = position === current

  return (
    <Button
      icon={Icon}
      circular
      backgroundColor={isActive ? '$color8' : undefined}
      onPress={() => onPress(position)}
      testID={testID}
    />
  )
}
