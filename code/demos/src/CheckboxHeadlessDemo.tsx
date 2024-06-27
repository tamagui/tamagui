import type { CheckboxProps as CheckboxHeadlessProps } from '@tamagui/checkbox-headless'
import { useCheckbox } from '@tamagui/checkbox-headless'
import { Check, Minus } from '@tamagui/lucide-icons'
import { forwardRef, useState } from 'react'
import type { View } from 'react-native'
import { Pressable } from 'react-native'
import { Label, XStack, YStack } from 'tamagui'

export function CheckboxHeadlessDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <XStack space="$3" alignItems="center">
        <HeadlessCheckbox defaultChecked="indeterminate" id="headless" />

        <Label htmlFor="headless">Headless</Label>
      </XStack>
    </YStack>
  )
}

const HeadlessCheckbox = forwardRef<View, CheckboxHeadlessProps>((props, ref) => {
  const [checked, setChecked] = useState(props.defaultChecked || false)
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
