import type { SwitchProps as SwitchHeadlessProps } from '@tamagui/switch-headless'
import { useSwitch } from '@tamagui/switch-headless'
import React from 'react'
import type { View as RNView } from 'react-native'
import { Pressable } from 'react-native'
import { Label, View, XStack, YStack } from 'tamagui'

export function SwitchHeadlessDemo() {
  return (
    <YStack width={200} items="center" gap="3">
      <XStack gap="3" items="center">
        <Label htmlFor="headless">Headless</Label>
        <HeadlessSwitch defaultChecked id="headless" />
      </XStack>
    </YStack>
  )
}

const HeadlessSwitch = React.forwardRef<RNView, SwitchHeadlessProps>((props, ref) => {
  const [checked, setChecked] = React.useState(props.defaultChecked || false)
  const { switchProps, switchRef, bubbleInput } = useSwitch(
    props,
    [checked, setChecked],
    ref
  )

  return (
    <>
      <Pressable
        style={{
          width: 40,
          height: 20,
          borderRadius: 100,
          backgroundColor: checked ? 'lightblue' : 'silver',
        }}
        ref={switchRef}
        {...switchProps}
      >
        <View
          transition="quick"
          width={20}
          height={20}
          rounded={100}
          bg="black"
          x={checked ? 20 : 0}
        />
      </Pressable>
      {bubbleInput}
    </>
  )
})
