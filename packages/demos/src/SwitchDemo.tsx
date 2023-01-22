import { Label, Separator, SizeTokens, Switch, XStack, YStack, styled } from 'tamagui'

export function SwitchDemo() {
  return (
    <YStack w={200} ai="center" space="$3">
      <SwitchWithLabel size="$2" />
      <SwitchWithLabel size="$3" />
      <SwitchWithLabel size="$4" />
      <SwitchWithLabel size="$5" />
    </YStack>
  )
}

function SwitchWithLabel(props: { size: SizeTokens }) {
  const id = `switch-${props.size.toString().slice(1)}`
  return (
    <XStack w={200} ai="center" space="$4">
      <Label pr="$0" miw={90} jc="flex-end" size={props.size} htmlFor={id}>
        Dark mode
      </Label>
      <Separator mih={20} vertical />
      <Switch id={id} size={props.size}>
        <Switch.Thumb animation="quick" />
      </Switch>
    </XStack>
  )
}
