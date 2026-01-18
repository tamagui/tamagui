import { useState } from 'react'
import { Button, Paragraph, Tooltip, YStack, XStack } from 'tamagui'

/**
 * Test case for validating CSS tooltip animation behavior
 *
 * Tests:
 * 1. Enter animation - y translation and opacity should animate smoothly with intermediate values
 * 2. Exit animation - should fade out and translate with intermediate values
 * 3. First show vs subsequent shows - should behave identically
 * 4. Arrow size validation
 *
 * Uses 1000ms animation for reliable intermediate state capture (same as AnimationBehavior tests)
 */
export function TooltipAnimationCase() {
  const [showCount, setShowCount] = useState(0)

  return (
    <YStack flex={1} gap="$8" p="$4" bg="$background" alignItems="center" justifyContent="center">
      <XStack gap="$4">
        <Paragraph data-testid="show-count">Show count: {showCount}</Paragraph>
      </XStack>

      {/* Main tooltip for animation testing - uses 1000ms animation for reliable intermediate capture */}
      <Tooltip
        placement="bottom"
        delay={0}
        restMs={0}
        onOpenChange={(open) => {
          if (open) setShowCount((c) => c + 1)
        }}
      >
        <Tooltip.Trigger data-testid="tooltip-trigger">
          <Button size="$4">Hover for tooltip</Button>
        </Tooltip.Trigger>

        <Tooltip.Content
          data-testid="tooltip-content"
          enterStyle={{ y: -20, opacity: 0 }}
          exitStyle={{ y: -20, opacity: 0 }}
          y={0}
          opacity={1}
          transition="lazy"
          animateOnly={['transform', 'opacity']}
        >
          <Tooltip.Arrow data-testid="tooltip-arrow" size="$2" />
          <Paragraph size="$2">Tooltip content</Paragraph>
        </Tooltip.Content>
      </Tooltip>

      {/* Second tooltip to test first vs subsequent shows */}
      <Tooltip placement="top" delay={0} restMs={0}>
        <Tooltip.Trigger data-testid="tooltip-trigger-2">
          <Button size="$4">Second tooltip</Button>
        </Tooltip.Trigger>

        <Tooltip.Content
          data-testid="tooltip-content-2"
          enterStyle={{ y: 20, opacity: 0 }}
          exitStyle={{ y: 20, opacity: 0 }}
          y={0}
          opacity={1}
          transition="lazy"
          animateOnly={['transform', 'opacity']}
        >
          <Tooltip.Arrow data-testid="tooltip-arrow-2" size="$2" />
          <Paragraph size="$2">Second tooltip</Paragraph>
        </Tooltip.Content>
      </Tooltip>

      {/* Quick animation tooltip for comparison - 100ms */}
      <Tooltip placement="right" delay={0} restMs={0}>
        <Tooltip.Trigger data-testid="tooltip-trigger-quick">
          <Button size="$4">Quick animation (100ms)</Button>
        </Tooltip.Trigger>

        <Tooltip.Content
          data-testid="tooltip-content-quick"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          x={0}
          opacity={1}
          transition="100ms"
          animateOnly={['transform', 'opacity']}
        >
          <Tooltip.Arrow data-testid="tooltip-arrow-quick" size="$3" />
          <Paragraph size="$2">Quick tooltip</Paragraph>
        </Tooltip.Content>
      </Tooltip>
    </YStack>
  )
}
