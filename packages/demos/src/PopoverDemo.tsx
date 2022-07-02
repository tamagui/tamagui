import { ChevronDown, ChevronLeft, ChevronRight } from '@tamagui/feather-icons'
import { Button, Input, Label, Popover, PopoverProps, XStack, YStack } from 'tamagui'

export function PopoverDemo() {
  return (
    <XStack space="$2">
      <Demo placement="left" Icon={ChevronLeft} />
      <Demo placement="bottom" Icon={ChevronDown} />
      <Demo placement="right" Icon={ChevronRight} />
    </XStack>
  )
}

export function Demo({ Icon, ...props }: PopoverProps & { Icon?: any }) {
  return (
    <Popover modal {...props}>
      <Popover.Trigger>
        <Button icon={Icon} />
      </Popover.Trigger>
      <Popover.Content
        elevation="$4"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        p="$2"
        br="$4"
        x={0}
        y={0}
        o={1}
        animation="bouncy"
        elevate
      >
        <Popover.Arrow />

        <YStack p="$3">
          <XStack space="$3">
            <Label size="$3" htmlFor="name">
              Name
            </Label>
            <Input size="$3" id="name" />
          </XStack>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
