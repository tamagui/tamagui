import { Check as CheckIcon } from '@tamagui/lucide-icons'
import type { CheckboxProps } from 'tamagui'
import { Checkbox, Label, XStack, YStack } from 'tamagui'

export function CheckboxDemo() {
  return (
    <YStack width={300} alignItems="center" gap="$2">
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
}: CheckboxProps & { label?: string }) {
  const id = `checkbox-${(size || '').toString().slice(1)}`
  return (
    <XStack width={300} alignItems="center" gap="$4">
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
