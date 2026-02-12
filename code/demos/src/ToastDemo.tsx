import { Toast, toast, type ToastPosition, type ToastT } from '@tamagui/toast'
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
} from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'
import { Button, SizableText, XStack, YStack } from 'tamagui'

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
    <Toast position={position} closeButton>
      <Toast.Viewport>
        <Toast.List
          renderItem={({ toast: t, index }) => (
            <Toast.Item key={t.id} toast={t} index={index} testID="toast-item">
              <ToastContent toast={t} />
            </Toast.Item>
          )}
        />
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

function ToastContent({ toast: t }: { toast: ToastT }) {
  const title = typeof t.title === 'function' ? t.title() : t.title
  const description =
    typeof t.description === 'function' ? t.description() : t.description

  return (
    <XStack gap="$3" alignItems="flex-start">
      <Toast.Icon />
      <YStack flex={1} gap="$0.5">
        {title && (
          <Toast.Title fontWeight="600" size="$3">
            {title}
          </Toast.Title>
        )}
        {description && (
          <Toast.Description color="$color9" size="$2">
            {description}
          </Toast.Description>
        )}
      </YStack>
    </XStack>
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
