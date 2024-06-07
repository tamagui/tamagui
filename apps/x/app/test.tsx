import { TooltipDemo } from '@tamagui/demos'
import { useEffect } from 'react'
import { Button, Paragraph, Tooltip } from 'tamagui'

export default function TestPage() {
  useEffect(() => {
    console.warn('hi mom')
  }, [])

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button size={100} als="center" circular />
      </Tooltip.Trigger>
      <Tooltip.Content
        debug="verbose"
        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Tooltip.Arrow />
        <Paragraph size="$2" lineHeight="$1">
          Hello world
        </Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}
