import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle } from '@tamagui/feather-icons'
import React from 'react'
import { Button, HoverablePopover, HoverablePopoverProps, Paragraph, XStack, YStack } from 'tamagui'

export function HoverablePopoverDemo() {
  return (
    <YStack space>
      <XStack space>
        <Demo placement="top right" trigger={(props) => <Button icon={Circle} {...props} />} />
        <Demo placement="top" trigger={(props) => <Button icon={ChevronUp} {...props} />} />
        <Demo placement="top left" trigger={(props) => <Button icon={Circle} {...props} />} />
      </XStack>
      <XStack space>
        <Demo placement="left" trigger={(props) => <Button icon={ChevronLeft} {...props} />} />
        <Button opacity={0} icon={Circle} />
        <Demo placement="right" trigger={(props) => <Button icon={ChevronRight} {...props} />} />
      </XStack>
      <XStack space>
        <Demo placement="bottom right" trigger={(props) => <Button icon={Circle} {...props} />} />
        <Demo placement="bottom" trigger={(props) => <Button icon={ChevronDown} {...props} />} />
        <Demo placement="bottom left" trigger={(props) => <Button icon={Circle} {...props} />} />
      </XStack>
    </YStack>
  )
}

export function Demo(props: Omit<HoverablePopoverProps, 'children'>) {
  return (
    <HoverablePopover {...props}>
      <HoverablePopover.Arrow backgroundColor="$bg" />
      <YStack backgroundColor="$bg" p="$3" elevation={2} borderRadius="$4">
        <Paragraph fontWeight="600">HoverablePopover contents</Paragraph>
        <Paragraph>Lorem ipsum dolor sit amet.</Paragraph>
      </YStack>
    </HoverablePopover>
  )
}
