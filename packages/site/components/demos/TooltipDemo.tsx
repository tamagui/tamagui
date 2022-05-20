import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle } from '@tamagui/feather-icons'
import { Button, Paragraph, Tooltip, TooltipGroup, TooltipProps, XStack, YStack } from 'tamagui'

export default function TooltipDemo() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <YStack space="$2" als="center">
        <XStack space="$2">
          <Demo groupId="0" placement="top-start" Icon={Circle} />
          <Demo groupId="1" placement="top" Icon={ChevronUp} />
          <Demo groupId="2" placement="top-end" Icon={Circle} />
        </XStack>
        <XStack space="$2">
          <Demo groupId="3" placement="left" Icon={ChevronLeft} />
          <YStack f={1} />
          <Demo groupId="4" placement="right" Icon={ChevronRight} />
        </XStack>
        <XStack space="$2">
          <Demo groupId="5" placement="bottom-start" Icon={Circle} />
          <Demo groupId="6" placement="bottom" Icon={ChevronDown} />
          <Demo groupId="7" placement="bottom-end" Icon={Circle} />
        </XStack>
      </YStack>
    </TooltipGroup>
  )
}

export function Demo({ Icon, ...props }: TooltipProps & { Icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>
        <Button icon={Icon} circular />
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
