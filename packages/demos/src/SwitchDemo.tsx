import { createSwitch as createHeadlessSwitch } from '@tamagui/switch-headless'
import { useContext } from 'react'
import { Pressable, View } from 'react-native'
import {
  Label,
  Separator,
  SizeTokens,
  SwitchContext,
  SwitchFrame,
  SwitchThumb,
  XStack,
  YStack,
  createSwitch,
} from 'tamagui'

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})

export const HeadlessSwitch = createHeadlessSwitch({
  Frame: function ({ children: childrenProp, ...props }) {
    const context = useContext(SwitchContext)
    const { checked } = context
    const children =
      typeof childrenProp === 'function' ? childrenProp(checked || false) : childrenProp

    return (
      <Pressable
        style={{
          width: 50,
          height: 20,
          borderRadius: 100,
          backgroundColor: checked ? 'gray' : 'darkgray',
        }}
        {...props}
      >
        {children}
      </Pressable>
    )
  },
  Thumb: function ({ children, ...props }) {
    const context = useContext(SwitchContext)
    const { checked } = context
    return (
      <View
        style={{
          backgroundColor: 'black',
          width: 20,
          height: 20,
          borderRadius: 100,
          transform: [
            {
              translateX: checked ? 30 : 0,
            },
          ],
        }}
        {...props}
      >
        {children}
      </View>
    )
  },
})

export function SwitchDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <XStack space="$3" alignItems="center">
        <Label htmlFor="headless">Headless</Label>
        <HeadlessSwitch id="headless">
          <HeadlessSwitch.Thumb />
        </HeadlessSwitch>
      </XStack>
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
