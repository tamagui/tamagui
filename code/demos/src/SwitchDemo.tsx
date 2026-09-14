import type { SizeTokens } from 'tamagui'
import { Label, Separator, Switch, XStack, YStack } from 'tamagui'

export function SwitchDemo() {
  return (
    <YStack width={200} items="center" gap="3">
      <XStack gap="3" flexDirection="xs:column">
        <SwitchWithLabel size="3" />
        <SwitchWithLabel size="3" defaultChecked />
      </XStack>
      <XStack gap="3" flexDirection="xs:column">
        <SwitchWithLabel size="4" />
        <SwitchWithLabel size="4" defaultChecked />
      </XStack>
      <XStack gap="3" flexDirection="xs:column">
        <SwitchWithLabel size="5" />
        <SwitchWithLabel size="5" defaultChecked />
      </XStack>
    </YStack>
  )
}

export function SwitchWithLabel(props: { size: SizeTokens; defaultChecked?: boolean }) {
  const id = `switch-${props.size}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={200} items="center" gap="4">
      <Label pr="0" minW={90} justify="flex-end" size={props.size} htmlFor={id}>
        Accept
      </Label>
      <Separator minH={20} vertical />
      <Switch
        id={id}
        transition="quick"
        size={props.size}
        defaultChecked={props.defaultChecked}
      >
        <Switch.Thumb transition="quickest" />
      </Switch>
    </XStack>
  )
}
