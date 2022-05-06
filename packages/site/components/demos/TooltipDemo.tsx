import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle } from '@tamagui/feather-icons'
import { Button, Paragraph, Tooltip, TooltipGroup, TooltipProps, XStack, YStack } from 'tamagui'

export default function TooltipDemo() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <YStack space als="center">
        <XStack space>
          <Demo groupId="0" placement="top-start" icon={Circle} />
          <Demo groupId="1" placement="top" icon={ChevronUp} />
          <Demo groupId="2" placement="top-end" icon={Circle} />
        </XStack>
        <XStack space>
          <Demo groupId="3" placement="left" icon={ChevronLeft} />
          <Button f={1} opacity={0} />
          <Demo groupId="4" placement="right" icon={ChevronRight} />
        </XStack>
        <XStack space>
          <Demo groupId="5" placement="bottom-start" icon={Circle} />
          <Demo groupId="6" placement="bottom" icon={ChevronDown} />
          <Demo groupId="7" placement="bottom-end" icon={Circle} />
        </XStack>
      </YStack>
    </TooltipGroup>
  )
}

export function Demo({ icon, ...props }: TooltipProps & { icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>
        <Button>Open</Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        enterStyle={{ x: 0, y: -5, o: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -5, o: 0, scale: 0.9 }}
        scale={1}
        x={0}
        y={0}
        o={1}
        animation="bouncy"
      >
        <Tooltip.Arrow />
        <Paragraph>Hello world</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}
