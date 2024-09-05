import React from 'react'
import type { SwitchProps as SwitchHeadlessProps } from '@tamagui/switch-headless'
import { useSwitch } from '@tamagui/switch-headless'

import type { View } from 'react-native'
import { Animated, Pressable } from 'react-native'
import { Label, XStack, YStack } from 'tamagui'

export function SwitchHeadlessDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <XStack gap="$3" alignItems="center">
        <Label htmlFor="headless">Headless</Label>
        <HeadlessSwitch defaultChecked id="headless" />
      </XStack>
    </YStack>
  )
}

const HeadlessSwitch = React.forwardRef<View, SwitchHeadlessProps>((props, ref) => {
  const [checked, setChecked] = React.useState(props.defaultChecked || false)
  const { switchProps, switchRef, bubbleInput } = useSwitch(
    props,
    [checked, setChecked],
    ref
  )

  const animation = React.useRef(new Animated.Value(checked ? 1 : 0)).current

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: checked ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }, [checked])

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
        <Animated.View
          style={[
            {
              backgroundColor: 'black',
              borderRadius: 100,
              width: 20,
              height: 20,
            },
            {
              transform: [
                {
                  translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        />
      </Pressable>
      {bubbleInput}
    </>
  )
})
