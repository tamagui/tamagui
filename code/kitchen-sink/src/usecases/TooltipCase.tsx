import { Button, Paragraph, Tooltip, TooltipSimple, YStack } from 'tamagui'

export function TooltipCase() {
  return (
    <YStack flex={1} gap="$8" p="$4" bg="$background">
      <TooltipComp />

      <Tooltip focus={{ enabled: true }} delay={0} restMs={0}>
        <Tooltip.Trigger data-testid="focus-tooltip-trigger">
          <Button>focus tooltip</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Paragraph data-testid="focus-tooltip-content">focus tooltip content</Paragraph>
        </Tooltip.Content>
      </Tooltip>

      <TooltipSimple label="wtf">
        <Button>simple tool</Button>
      </TooltipSimple>
    </YStack>
  )
}

function TooltipComp() {
  return (
    <Tooltip placement="bottom">
      <Tooltip.Trigger>
        <Button>with tooltip</Button>
      </Tooltip.Trigger>

      <Tooltip.Content
        enterStyle={{ x: 0, y: -4, opacity: 0, scale: 0.96 }}
        exitStyle={{ x: 0, y: -4, opacity: 0, scale: 0.96 }}
        transition="bouncy"
      >
        <Tooltip.Arrow />
        <Paragraph>some tooltip</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}
