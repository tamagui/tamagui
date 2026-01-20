import { Paragraph, Text, Tooltip, XStack, YStack } from 'tamagui'

export function TooltipTriggerInlineCase() {
  return (
    <YStack flex={1} gap="$4" p="$4" bg="$background">
      <Paragraph>
        This tests that{' '}
        <Tooltip>
          <Tooltip.Trigger display="inline" data-testid="inline-tooltip-trigger">
            <Text
              data-testid="inline-tooltip-text"
              color="$blue10"
              textDecorationLine="underline"
            >
              inline tooltip triggers
            </Text>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Paragraph data-testid="inline-tooltip-content">Tooltip content</Paragraph>
          </Tooltip.Content>
        </Tooltip>{' '}
        work correctly within text.
      </Paragraph>

      <XStack gap="$2" flexWrap="wrap">
        <Text>Words:</Text>
        <Tooltip>
          <Tooltip.Trigger display="inline" data-testid="inline-word-1">
            <Text color="$green10" textDecorationLine="underline">
              hover
            </Text>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Paragraph>Word 1 tooltip</Paragraph>
          </Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger display="inline" data-testid="inline-word-2">
            <Text color="$red10" textDecorationLine="underline">
              over
            </Text>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Paragraph>Word 2 tooltip</Paragraph>
          </Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger display="inline" data-testid="inline-word-3">
            <Text color="$blue10" textDecorationLine="underline">
              these
            </Text>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Paragraph>Word 3 tooltip</Paragraph>
          </Tooltip.Content>
        </Tooltip>
      </XStack>
    </YStack>
  )
}
