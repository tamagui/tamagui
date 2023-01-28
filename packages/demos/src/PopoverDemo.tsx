import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons'
import {
  Adapt,
  Button,
  Input,
  Label,
  Popover,
  PopoverProps,
  XStack,
  YGroup,
} from 'tamagui'

export function PopoverDemo() {
  return (
    <XStack space="$2" f={1} jc="center" ai="center">
      <Demo placement="left" Icon={ChevronLeft} Name="left-popover" />
      <Demo placement="bottom" Icon={ChevronDown} Name="bottom-popover" />
      <Demo placement="top" Icon={ChevronUp} Name="top-popover" />
      <Demo placement="right" Icon={ChevronRight} Name="right-popover" />
    </XStack>
  )
}

export function Demo({
  Icon,
  Name,
  ...props
}: PopoverProps & { Icon?: any; Name?: string }) {
  return (
    <Popover size="$5" {...props}>
      <Popover.Trigger asChild>
        <Button icon={Icon} />
      </Popover.Trigger>

      <Adapt when="sm" platform="web">
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

        <YGroup space="$3">
          <XStack space="$3">
            <Label size="$3" htmlFor={Name}>
              Name
            </Label>
            <Input size="$3" id={Name} />
          </XStack>
          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}
            >
              Submit
            </Button>
          </Popover.Close>
        </YGroup>
      </Popover.Content>
    </Popover>
  )
}
