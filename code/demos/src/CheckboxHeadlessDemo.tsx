import React from 'react'
import type { CheckboxProps as CheckboxHeadlessProps } from '@tamagui/checkbox-headless'
import { useCheckbox } from '@tamagui/checkbox-headless'
import { Check, Minus } from '@tamagui/lucide-icons'

import type { View } from 'react-native'
import { Pressable } from 'react-native'
import { Label, XStack, YStack } from 'tamagui'

export function CheckboxHeadlessDemo() {
  return (
    <YStack width={200} alignItems="center" gap="$3">
      <XStack gap="$3" alignItems="center">
        <HeadlessCheckbox defaultChecked="indeterminate" id="headless" />
        <Label htmlFor="headless">Headless</Label>
      </XStack>
    </YStack>
  )
}

const HeadlessCheckbox = React.forwardRef<View, CheckboxHeadlessProps>((props, ref) => {
  const [checked, setChecked] = React.useState(props.defaultChecked || false)
  const { checkboxProps, checkboxRef, bubbleInput } = useCheckbox(
    props,
    [checked, setChecked],
    ref
  )

  return (
    <Pressable
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: checked === true ? 'lightblue' : 'silver',
      }}
      ref={checkboxRef}
      {...checkboxProps}
    >
      {checked === 'indeterminate' && <Minus width={18} height={18} />}
      {checked === true && <Check width={18} height={18} />}
      {bubbleInput}
    </Pressable>
  )
})
