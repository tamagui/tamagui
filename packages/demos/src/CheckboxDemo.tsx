import { useCheckbox } from '@tamagui/checkbox-headless'
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { forwardRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  Checkbox,
  CheckboxFrame,
  CheckboxIndicatorFrame,
  CheckboxProps,
  Label,
  SizeTokens,
  XStack,
  YStack,
  createCheckbox,
} from 'tamagui'

export function CheckboxDemo() {
  return (
    <YStack width={300} alignItems="center" space="$2">
      <XStack width={300} alignItems="center" space="$4">
        <HeadlessCheckbox id="useCheckbox" />

        <Label htmlFor="useCheckbox">useCheckbox</Label>
      </XStack>
      <XStack width={300} alignItems="center" space="$4">
        <CustomCheckbox id="createCheckbox">
          <CustomCheckbox.Indicator>
            <CheckIcon />
          </CustomCheckbox.Indicator>
        </CustomCheckbox>

        <Label htmlFor="createCheckbox">createCheckbox</Label>
      </XStack>
      <CheckboxWithLabel size="$3" />
      <CheckboxWithLabel size="$4" defaultChecked />
      <CheckboxWithLabel size="$5" disabled label="Accept terms (disabled)" />
    </YStack>
  )
}

export function CheckboxWithLabel({
  size,
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxProps & { size: SizeTokens; label?: string }) {
  const id = `checkbox-${size.toString().slice(1)}`
  return (
    <XStack width={300} alignItems="center" space="$4">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}

export const CustomCheckbox = createCheckbox({
  Frame: CheckboxFrame,
  Indicator: CheckboxIndicatorFrame,
})

export const HeadlessCheckbox = forwardRef<View, CheckboxProps>(function (props, ref) {
  const [checked, setChecked] = useState(props.defaultChecked || false)
  const { checkboxProps, bubbleInput } = useCheckbox(props, [checked, setChecked], ref)

  return (
    <Pressable
      style={{
        width: 40,
        height: 40,
        backgroundColor: 'red',
      }}
      {...checkboxProps}
    >
      {checked === 'indeterminate' && <Text>Indeterminate</Text>}
      {checked === true && <Text>Checked</Text>}
      {bubbleInput}
    </Pressable>
  )
})
