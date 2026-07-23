import { Paragraph, Tooltip, TooltipGroup, YStack, XStack } from 'tamagui'
import { Button } from '../components/Button'
import { useState } from 'react'

/**
 * Test case for "global tooltip" pattern: a single scoped tooltip with
 * triggers in opposite corners.
 *
 * Bug: when switching between far-apart triggers, the tooltip animates
 * across the screen instead of snapping to the new position.
 */
export function TooltipGlobalPatternCase() {
  const [label, setLabel] = useState('')

  return (
    <YStack flex={1} bg="$background" p="$4" minHeight={600} minWidth={800}>
      <TooltipGroup delay={{ open: 0, close: 150 }}>
        <Tooltip scope="global-tip" offset={12} placement="bottom">
          <YStack flex={1} justifyContent="space-between">
            <XStack justifyContent="space-between">
              <Tooltip.Trigger
                scope="global-tip"
                asChild
                onMouseEnter={() => setLabel('Top Left')}
              >
                <Button data-testid="trigger-tl" size="medium">
                  Top Left
                </Button>
              </Tooltip.Trigger>

              <Tooltip.Trigger
                scope="global-tip"
                asChild
                onMouseEnter={() => setLabel('Top Right')}
              >
                <Button data-testid="trigger-tr" size="medium">
                  Top Right
                </Button>
              </Tooltip.Trigger>
            </XStack>

            <XStack justifyContent="space-between">
              <Tooltip.Trigger
                scope="global-tip"
                asChild
                onMouseEnter={() => setLabel('Bottom Left')}
              >
                <Button data-testid="trigger-bl" size="medium">
                  Bottom Left
                </Button>
              </Tooltip.Trigger>

              <Tooltip.Trigger
                scope="global-tip"
                asChild
                onMouseEnter={() => setLabel('Bottom Right')}
              >
                <Button data-testid="trigger-br" size="medium">
                  Bottom Right
                </Button>
              </Tooltip.Trigger>
            </XStack>
          </YStack>

          <Tooltip.Content
            data-testid="global-tip-content"
            animatePosition
            transition="200ms"
            bg="$background"
            boxShadow="0 4px 12px $shadowColor"
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
    </YStack>
  )
}
