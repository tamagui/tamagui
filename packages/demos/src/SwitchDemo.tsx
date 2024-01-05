import { SwitchProps, useSwitch } from '@tamagui/switch-headless'
import { forwardRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import {
  Label,
  Separator,
  SizeTokens,
  Switch,
  SwitchFrame,
  SwitchThumb,
  XStack,
  YStack,
  createSwitch,
} from 'tamagui'

export function SwitchDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <XStack space="$3" alignItems="center">
        <Label htmlFor="createSwitch">createSwitch</Label>
        <CustomSwitch id="createSwitch">
          <CustomSwitch.Thumb />
        </CustomSwitch>
      </XStack>
      <XStack space="$3" alignItems="center">
        <Label htmlFor="useSwitch">useSwitch</Label>
        <HeadlessSwitch defaultChecked id="useSwitch" />
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

export const CustomSwitch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})

export const HeadlessSwitch = forwardRef<View, SwitchProps>(function (props, ref) {
  const [checked, setChecked] = useState(props.defaultChecked || false)
  const { switchProps, bubbleInput } = useSwitch(props, [checked, setChecked], ref)

  return (
    <Pressable
      style={{
        width: 60,
        height: 20,
        borderRadius: 100,
        backgroundColor: checked ? 'gray' : 'darkgray',
      }}
      {...switchProps}
    >
      <View
        style={{
          backgroundColor: 'black',
          borderRadius: 100,
          width: 20,
          height: 20,
          transform: [
            {
              translateX: checked ? 40 : 0,
            },
          ],
        }}
      />
      {bubbleInput}
    </Pressable>
  )
})
