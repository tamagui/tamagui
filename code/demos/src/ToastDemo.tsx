import { Toast, toast, useToastItem, type ToastPosition, type ToastT } from 'tamagui'
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
} from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'
import { Button, Label, SizableText, Slider, XStack, YStack } from 'tamagui'

export const ToastDemo = () => {
  const [position, setPosition] = useState<ToastPosition>('bottom-right')
  const [gap, setGap] = useState(14)
  const [visibleToasts, setVisibleToasts] = useState(4)
  const [duration, setDuration] = useState(4000)
  const count = useRef(0)

  const showToast = (newPosition: ToastPosition) => {
    setPosition(newPosition)
    count.current++
    toast(`Toast #${count.current}`, {
      description: 'Swipe to dismiss or wait for auto-close.',
    })
  }

  return (
    <Toast
      position={position}
      gap={gap}
      visibleToasts={visibleToasts}
      duration={duration}
    >
      <Toast.Viewport>
        <Toast.List
          renderItem={({ toast: t, index }) => (
            <Toast.Item key={t.id} toast={t} index={index} testID="toast-item">
              <ToastContent toast={t} />
            </Toast.Item>
          )}
        />
      </Toast.Viewport>

      <YStack gap="$3" self="center" width={280}>
        {/* Position buttons */}
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

        {/* Controls */}
        <YStack gap="$2" paddingTop="$2">
          <DemoSlider
            label="Gap"
            value={gap}
            min={0}
            max={30}
            step={2}
            onChange={setGap}
          />
          <DemoSlider
            label="Visible"
            value={visibleToasts}
            min={1}
            max={8}
            step={1}
            onChange={setVisibleToasts}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            min={1000}
            max={10000}
            step={500}
            onChange={setDuration}
            format={(v) => `${(v / 1000).toFixed(1)}s`}
          />
        </YStack>
      </YStack>
    </Toast>
  )
}

function ToastContent({ toast: t }: { toast: ToastT }) {
  const { handleClose } = useToastItem()

  const title = typeof t.title === 'function' ? t.title() : t.title
  const description =
    typeof t.description === 'function' ? t.description() : t.description

  return (
    <>
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

      <Toast.Close testID="toast-close-button" position="absolute" top={-6} left={-6} zIndex={1} />
    </>
  )
}

function DemoSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <XStack gap="$3" alignItems="center">
      <Label size="$2" width={60}>
        {label}
      </Label>
      <Slider
        flex={1}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb theme="accent" size={16} borderRadius={100} index={0} />
      </Slider>
      <SizableText size="$2" width={40} textAlign="right">
        {format ? format(value) : value}
      </SizableText>
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
      theme={isActive ? 'accent' : undefined}
      onPress={() => onPress(position)}
      testID={testID}
    />
  )
}
