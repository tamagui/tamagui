import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
} from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Button,
  Paragraph,
  SizableText,
  Switch,
  Tooltip,
  TooltipGroup,
  TooltipProps,
  XStack,
  YStack,
} from 'tamagui'

export function TooltipDemo() {
  const [follow, setFollow] = useState(false)

  return (
    <>
      <TooltipGroup delay={{ open: 3000, close: 100 }}>
        <YStack space="$2" alignSelf="center">
          <XStack space="$2">
            <Demo follow={follow} groupId="0" placement="top-end" Icon={Circle} />
            <Demo follow={follow} groupId="1" placement="top" Icon={ChevronUp} />
            <Demo follow={follow} groupId="2" placement="top-start" Icon={Circle} />
          </XStack>
          <XStack space="$2">
            <Demo follow={follow} groupId="3" placement="left" Icon={ChevronLeft} />
            <YStack flex={1} />
            <Demo follow={follow} groupId="4" placement="right" Icon={ChevronRight} />
          </XStack>
          <XStack space="$2">
            <Demo follow={follow} groupId="5" placement="bottom-end" Icon={Circle} />
            <Demo follow={follow} groupId="6" placement="bottom" Icon={ChevronDown} />
            <Demo follow={follow} groupId="7" placement="bottom-start" Icon={Circle} />
          </XStack>
        </YStack>
      </TooltipGroup>
      <XStack pos="absolute" b="$4" l="$4">
        <FollowSwitch follow={follow} onChangeFollow={setFollow} />
      </XStack>
    </>
  )
}

function Demo({
  Icon,
  follow,
  ...props
}: TooltipProps & { Icon?: any; follow: boolean }) {
  return (
    <Tooltip
      followMouse
      // followMouse={follow}
      {...props}
    >
      <Tooltip.Trigger>
        <Button icon={Icon} circular />
      </Tooltip.Trigger>
      <Tooltip.Content
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

function FollowSwitch(props: {
  follow: boolean
  onChangeFollow: (next: boolean) => void
}) {
  return (
    <XStack zIndex={100000000} space="$2" ai="center">
      <SizableText size="$2">Stay</SizableText>
      <Switch size="$1" checked={props.follow} onCheckedChange={props.onChangeFollow}>
        <Switch.Thumb animation="quick" />
      </Switch>
      <SizableText size="$2">Follow</SizableText>
    </XStack>
  )
}
