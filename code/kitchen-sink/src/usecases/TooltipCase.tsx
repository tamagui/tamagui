import { Button, Paragraph, Tooltip, TooltipSimple, YStack } from 'tamagui'

export function TooltipCase() {
  return (
    <YStack flex={1} gap="$8" p="$4" bg="$background">
      <TooltipComp />

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
