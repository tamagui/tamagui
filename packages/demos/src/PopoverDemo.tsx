import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from '@tamagui/lucide-icons'
import { Adapt, Button, Input, Label, Popover, PopoverProps, XStack } from 'tamagui'

export function PopoverDemo() {
  return (
    <XStack space="$2">
      <Demo placement="left" Icon={ChevronLeft} />
      <Demo placement="bottom" Icon={ChevronDown} />
      <Demo placement="top" Icon={ChevronUp} />
      <Demo placement="right" Icon={ChevronRight} />
    </XStack>
  )
}

export function Demo({ Icon, ...props }: PopoverProps & { Icon?: any }) {
  return (
    <Popover size="$5" {...props}>
      <Popover.Trigger asChild>
        <Button icon={Icon} />
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        x={0}
        y={0}
        o={1}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        elevate
      >
        <Popover.Arrow bw={1} boc="$borderColor" />

        <XStack space="$3">
          <Label size="$3" htmlFor="name">
            Name
          </Label>
          <Input size="$3" id="name" />
        </XStack>
      </Popover.Content>
    </Popover>
  )
}
