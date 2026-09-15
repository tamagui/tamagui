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

// the label speaks the font scale: these keys are the control font px
const switchLabelSize = {
  xs: '2',
  sm: '4',
  md: '4',
  lg: '5',
  xl: '6',
} as const

export function SwitchWithLabel(props: { size: SwitchSize; defaultChecked?: boolean }) {
  const id = `switch-${props.size}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={200} items="center" gap="4">
      <Label
        pr="0"
        minW={90}
        justify="flex-end"
        size={typeof props.size === 'string' ? switchLabelSize[props.size] : '4'}
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
