import type { SizeTokens } from 'tamagui'
import { Label, Separator, Switch, Theme, XStack, YStack } from 'tamagui'

export function SwitchDemo() {
  return (
    <>
      <YStack width={200} items="center" gap="$3">
        <XStack gap="$3" $xs={{ flexDirection: 'column' }}>
          <SwitchWithLabel size="$2" />
          <SwitchWithLabel size="$2" defaultChecked />
        </XStack>
        <XStack gap="$3" $xs={{ flexDirection: 'column' }}>
          <SwitchWithLabel size="$3" />
          <SwitchWithLabel size="$3" defaultChecked />
        </XStack>
        <XStack gap="$3" $xs={{ flexDirection: 'column' }}>
          <SwitchWithLabel size="$4" />
          <SwitchWithLabel size="$4" defaultChecked />
        </XStack>
      </YStack>
    </>
  )
}

export function SwitchWithLabel(props: {
  size: SizeTokens
  defaultChecked?: boolean
  activeStyle?: boolean
}) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={200} items="center" gap="$4">
      <Label pr="$0" minW={90} justify="flex-end" size={props.size} htmlFor={id}>
        Accept
      </Label>
      <Separator minH={20} vertical />
      <Switch
        id={id}
        transition="300ms"
        size={props.size}
        defaultChecked={props.defaultChecked}
        // use activeStyle to choose youra active color
        // default to $backgroundActive unless "unstyled" boolean prop is on
        activeStyle={{
          backgroundColor: '$color6',
        }}
      >
        <Switch.Thumb transition="quickest" />
      </Switch>
    </XStack>
  )
}
