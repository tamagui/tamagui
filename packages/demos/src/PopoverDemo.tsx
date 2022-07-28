import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Input, Label, Popover, PopoverProps, XStack, YStack } from 'tamagui'

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
      <Popover.Trigger>
        <Button icon={Icon} />
      </Popover.Trigger>
      <Popover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        x={0}
        y={0}
        o={1}
        animation="bouncy"
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
