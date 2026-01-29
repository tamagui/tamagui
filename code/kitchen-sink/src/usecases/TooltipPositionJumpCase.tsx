import { Button, Paragraph, Tooltip, TooltipGroup, XStack, YStack, SizableText } from 'tamagui'
import { useState } from 'react'

/**
 * Test case for tooltip position jump bug
 *
 * CRITICAL: This must match the PromoLinksRow pattern from tamagui.dev:
 * - Single Tooltip with scope
 * - Multiple Tooltip.Triggers with same scope
 * - animatePosition on Tooltip.Content
 *
 * The bug: When rapidly moving between triggers, the tooltip JUMPS
 * to wrong position (often near origin/top-left) before animating back.
 */

const buttons = [
  { id: 'takeout', label: 'Takeout — universal RN starter kit' },
  { id: 'bento', label: 'Bento — Free + paid pre-made UI' },
  { id: 'hire', label: 'Add Even — Expert React Native developers' },
]

export function TooltipPositionJumpCase() {
  const [label, setLabel] = useState('')

  return (
    <YStack flex={1} gap="$4" p="$4" bg="$background" alignItems="center" justifyContent="center">
      <SizableText fontWeight="bold">Tooltip Position Jump Test</SizableText>
      <SizableText size="$2" color="$gray11" textAlign="center">
        1. Hover rightmost button, wait for tooltip{'\n'}
        2. Move mouse QUICKLY left across all buttons{'\n'}
        3. Watch for tooltip jumping to wrong position
      </SizableText>

      {/* EXACT pattern from PromoLinksRow - scoped tooltip with animatePosition */}
      <TooltipGroup delay={{ open: 0, close: 150 }}>
        <Tooltip scope="promo-tooltip" offset={12} placement="bottom">
          <XStack gap="$3" mt="$4">
            {buttons.map((btn) => (
              <Tooltip.Trigger
                key={btn.id}
                scope="promo-tooltip"
                asChild
                onMouseEnter={() => setLabel(btn.label)}
              >
                <Button
                  data-testid={`tooltip-trigger-${btn.id}`}
                  size="$4"
                >
                  {btn.id.toUpperCase()}
                </Button>
              </Tooltip.Trigger>
            ))}
          </XStack>

          <Tooltip.Content
            data-testid="tooltip-jump-content"
            animatePosition
            transition="quick"
            bg="$background"
            elevation="$2"
            rounded="$4"
            px="$2.5"
            py="$1"
            enterStyle={{ y: -4, opacity: 0 }}
            exitStyle={{ y: -4, opacity: 0 }}
          >
            <Tooltip.Arrow />
            <Paragraph size="$3">{label}</Paragraph>
          </Tooltip.Content>
        </Tooltip>
      </TooltipGroup>

      <SizableText size="$1" color="$gray9" mt="$8">
        Tooltip content should animate smoothly between buttons.
        {'\n'}If it JUMPS to a wrong position first, the bug is present.
      </SizableText>
    </YStack>
  )
}
