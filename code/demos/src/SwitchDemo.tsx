import type { SwitchSize } from 'tamagui'
import { Label, Separator, Switch, XStack, YStack } from 'tamagui'

export function SwitchDemo() {
  return (
    <YStack width={200} items="center" gap="3">
      <XStack gap="3" flexDirection="xs:column">
        <SwitchWithLabel size="sm" />
        <SwitchWithLabel size="sm" defaultChecked />
      </XStack>
      <XStack gap="3" flexDirection="xs:column">
        <SwitchWithLabel size="md" />
        <SwitchWithLabel size="md" defaultChecked />
      </XStack>
      <XStack gap="3" flexDirection="xs:column">
        <SwitchWithLabel size="lg" />
        <SwitchWithLabel size="lg" defaultChecked />
      </XStack>
    </YStack>
  )
}

// the label speaks the font scale: named sizes hit the old 12/14/14/16/18px on web and native
const switchLabelSize = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'base',
  xl: 'lg',
} as const

export function SwitchWithLabel(props: { size: SwitchSize; defaultChecked?: boolean }) {
  const id = `switch-${props.size}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={200} items="center" gap="4">
      <Label
        pr="0"
        minW={90}
        justify="flex-end"
        size={typeof props.size === 'string' ? switchLabelSize[props.size] : 'sm'}
        htmlFor={id}
      >
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
