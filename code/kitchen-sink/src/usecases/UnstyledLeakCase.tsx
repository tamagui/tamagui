// reproduces soot's "unstyled forwards to DOM" report on the tooltip portal path.
// soot has: <TamaguiTooltip {...tooltipProps}> ... <TooltipContent unstyled ...>
// the goal is to render this pattern and see if React-DOM (dev build, so the
// "Received `%s` for a non-boolean attribute `unstyled`" warning is present)
// fires when the tooltip provider renders.
import { useEffect, useState } from 'react'
import {
  Button,
  Paragraph,
  Tooltip,
  TooltipGroup,
  XStack,
  YStack,
} from 'tamagui'

export function UnstyledLeakCase() {
  // toggle to force re-renders of the provider chain
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 800)
    return () => clearInterval(i)
  }, [])

  return (
    <YStack gap="$4" p="$4">
      <Paragraph>UnstyledLeakCase — tick: {tick}</Paragraph>
      <XStack gap="$3">
        {/* mirrors soot's GlobalTooltipProvider pattern: a Tooltip that always
            renders a TooltipContent with `unstyled` */}
        <Tooltip placement="bottom">
          <Tooltip.Trigger asChild>
            <Button id="leak-trigger-1">Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content
            unstyled
            enterStyle={{ x: 0, y: -3, opacity: 0 }}
            exitStyle={{ x: 0, y: -3, opacity: 0 }}
            x={0}
            scale={1}
            y={0}
            opacity={1}
            pointerEvents="none"
            py="$1.5"
            px="$2"
            maxWidth={320}
            borderRadius="$2"
            animatePosition
            animateOnly={['transform', 'opacity', 'width', 'height']}
            transition={'200ms' as any}
            backgroundColor="$color"
          >
            <Tooltip.Arrow />
            <Paragraph color="$background">tooltip text</Paragraph>
          </Tooltip.Content>
        </Tooltip>

        {/* same again wrapped in TooltipGroup like soot's GlobalTooltipProvider */}
        <TooltipGroup delay={0}>
          <Tooltip placement="bottom">
            <Tooltip.Trigger asChild>
              <Button id="leak-trigger-2">Hover me 2</Button>
            </Tooltip.Trigger>
            <Tooltip.Content
              unstyled
              backgroundColor="$color"
              py="$1.5"
              px="$2"
            >
              <Paragraph color="$background">tooltip 2</Paragraph>
            </Tooltip.Content>
          </Tooltip>
        </TooltipGroup>
      </XStack>
    </YStack>
  )
}
