import { Label, Separator, SizeTokens, Switch, XStack, YStack, styled } from 'tamagui'

export function SwitchDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <XStack space="$3" $xs={{ flexDirection: 'column' }}>
        <SwitchWithLabel size="$2" />
        <SwitchWithLabel size="$2" defaultChecked />
      </XStack>
      <XStack space="$3" $xs={{ flexDirection: 'column' }}>
        <SwitchWithLabel size="$3" />
        <SwitchWithLabel size="$3" defaultChecked />
      </XStack>
      <XStack space="$3" $xs={{ flexDirection: 'column' }}>
        <SwitchWithLabel size="$4" />
        <SwitchWithLabel size="$4" defaultChecked />
      </XStack>
      <XStack space="$3" $xs={{ flexDirection: 'column' }}>
        <SwitchWithLabel size="$5" />
        <SwitchWithLabel size="$5" defaultChecked />
      </XStack>
    </YStack>
  )
}

export function SwitchWithLabel(props: { size: SizeTokens; defaultChecked?: boolean }) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={200} alignItems="center" space="$4">
      <Label
        paddingRight="$0"
        minWidth={90}
        justifyContent="flex-end"
        size={props.size}
        htmlFor={id}
      >
        Accept
      </Label>
      <Separator minHeight={20} vertical />
      <Switch id={id} size={props.size} defaultChecked={props.defaultChecked}>
        <Switch.Thumb animation="quicker" />
      </Switch>
    </XStack>
  )
}
