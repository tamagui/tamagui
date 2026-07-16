import { RefreshCw, ZoomIn, ZoomOut } from '@tamagui/lucide-icons-2'
import type { Dispatch, SetStateAction } from 'react'
import { Group, SizableText, XStack } from 'tamagui'
import { Button } from '~/components/Button'

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
    <XStack items="center" gap="$4">
      <Group orientation="horizontal" size="$2">
        <Group.Item>
          <Button size="small" icon={ZoomOut} onPress={handleZoomOut} />
        </Group.Item>
        <Group.Item>
          <Button size="small" icon={RefreshCw} onPress={handleResetZoom} />
        </Group.Item>
        <Group.Item>
          <Button size="small" icon={ZoomIn} onPress={handleZoomIn} />
        </Group.Item>
      </Group>

      <SizableText size="$2">{value * 100}%</SizableText>
    </XStack>
  )
}
