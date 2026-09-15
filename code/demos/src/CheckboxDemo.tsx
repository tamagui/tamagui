import { Check as CheckIcon } from '@tamagui/lucide-icons-2'
import type { CheckboxSize } from 'tamagui'
import { Checkbox, Label, Theme, XStack, YStack } from 'tamagui'

// the label speaks the font scale: named sizes hit the old 12/14/14/16/18px on web and native
const checkboxLabelSize = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'base',
  xl: 'lg',
} as const

export function CheckboxDemo() {
  return (
    <YStack width={300} items="center" gap="2">
      <CheckboxWithLabel size="sm" />
      <CheckboxWithLabel size="md" defaultChecked />
      <CheckboxWithLabel size="lg" disabled label="Accept terms (disabled)" />
    </YStack>
  )
}

export function CheckboxWithLabel({
  size,
  label = 'Accept terms and conditions',
  disabled,
  defaultChecked,
}: {
  size?: CheckboxSize
  label?: string
  disabled?: boolean
  defaultChecked?: boolean
}) {
  const id = `checkbox-${size || ''}`
  return (
    <Theme name={disabled ? 'gray' : null}>
      <XStack width={300} items="center" gap="4">
        <Checkbox id={id} size={size} disabled={disabled} defaultChecked={defaultChecked}>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox>

        <Label
          size={typeof size === 'string' ? checkboxLabelSize[size] : 'sm'}
          htmlFor={id}
          opacity={disabled ? 0.5 : 1}
        >
          {label}
        </Label>
      </XStack>
    </Theme>
  )
}
