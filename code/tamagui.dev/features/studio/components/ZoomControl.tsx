import { RefreshCw, ZoomIn, ZoomOut } from '@tamagui/lucide-icons'
import type { Dispatch, SetStateAction } from 'react'
import { Button, Group, SizableText, XStack } from 'tamagui'

export const ZoomControls = ({
  value,
  onChange,
}: {
  value: number
  onChange: Dispatch<SetStateAction<number>>
}) => {
  const handleZoomIn = () => onChange((prev) => Math.min(2, prev * 2))
  const handleZoomOut = () => onChange((prev) => Math.max(0.25, prev / 2))
  const handleResetZoom = () => onChange(1)

  return (
    <XStack ai="center" space>
      <Group orientation="horizontal" size="$2">
        <Group.Item>
          <Button size="$2" icon={ZoomOut} onPress={handleZoomOut} />
        </Group.Item>
        <Group.Item>
          <Button size="$2" icon={RefreshCw} onPress={handleResetZoom} />
        </Group.Item>
        <Group.Item>
          <Button size="$2" icon={ZoomIn} onPress={handleZoomIn} />
        </Group.Item>
      </Group>

      <SizableText size="$2">{value * 100}%</SizableText>
    </XStack>
  )
}
