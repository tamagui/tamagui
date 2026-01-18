import { Button, Paragraph, Tooltip, TooltipGroup, XStack, YStack, Text } from 'tamagui'

/**
 * Test case for TooltipGroup behavior
 *
 * TooltipGroup should:
 * 1. Apply delay only to the first tooltip shown
 * 2. Show subsequent tooltips immediately when hovering between them
 */
export function TooltipGroupCase() {
  return (
    <YStack flex={1} gap="$6" p="$4" bg="$background">
      <Text fontWeight="bold">Grouped (1s delay, skip on subsequent):</Text>
      <TooltipGroup delay={{ open: 1000, close: 200 }} timeoutMs={500}>
        <XStack gap="$4" justifyContent="center">
          <Tooltip groupId="1" placement="bottom" restMs={0}>
            <Tooltip.Trigger data-testid="tooltip-trigger-1">
              <Button>Group 1</Button>
            </Tooltip.Trigger>
            <Tooltip.Content
              data-testid="tooltip-content-1"
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
            >
              <Tooltip.Arrow />
              <Paragraph size="$2">Tooltip 1</Paragraph>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip groupId="2" placement="bottom" restMs={0}>
            <Tooltip.Trigger data-testid="tooltip-trigger-2">
              <Button>Group 2</Button>
            </Tooltip.Trigger>
            <Tooltip.Content
              data-testid="tooltip-content-2"
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
            >
              <Tooltip.Arrow />
              <Paragraph size="$2">Tooltip 2</Paragraph>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip groupId="3" placement="bottom" restMs={0}>
            <Tooltip.Trigger data-testid="tooltip-trigger-3">
              <Button>Group 3</Button>
            </Tooltip.Trigger>
            <Tooltip.Content
              data-testid="tooltip-content-3"
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
            >
              <Tooltip.Arrow />
              <Paragraph size="$2">Tooltip 3</Paragraph>
            </Tooltip.Content>
          </Tooltip>
        </XStack>
      </TooltipGroup>

      <Text fontWeight="bold" mt="$4">
        Standalone (1s delay each):
      </Text>
      <XStack gap="$4" justifyContent="center">
        <Tooltip placement="bottom" delay={1000} restMs={0}>
          <Tooltip.Trigger data-testid="tooltip-trigger-standalone-a">
            <Button theme="alt1">Standalone A</Button>
          </Tooltip.Trigger>
          <Tooltip.Content
            data-testid="tooltip-content-standalone-a"
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
          >
            <Tooltip.Arrow />
            <Paragraph size="$2">Standalone A</Paragraph>
          </Tooltip.Content>
        </Tooltip>

        <Tooltip placement="bottom" delay={1000} restMs={0}>
          <Tooltip.Trigger data-testid="tooltip-trigger-standalone-b">
            <Button theme="alt1">Standalone B</Button>
          </Tooltip.Trigger>
          <Tooltip.Content
            data-testid="tooltip-content-standalone-b"
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
          >
            <Tooltip.Arrow />
            <Paragraph size="$2">Standalone B</Paragraph>
          </Tooltip.Content>
        </Tooltip>
      </XStack>
    </YStack>
  )
}
