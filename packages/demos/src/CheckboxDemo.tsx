import { Check as CheckIcon } from '@tamagui/lucide-icons'
import type { CheckboxProps, SizeTokens } from 'tamagui'
import { Checkbox, Label, XStack, YStack, styled } from 'tamagui'

export function CheckboxDemo() {
  return (
    <YStack width={300} alignItems="center" space="$2">
      <CheckboxWithLabel size="$3" />
    </YStack>
  )
}

const StyledIndicator = styled(Checkbox.Indicator, {
  dog: true,
})

export function CheckboxWithLabel({
  size,
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxProps & { size: SizeTokens; label?: string }) {
  const id = `checkbox-${size.toString().slice(1)}`
  return (
    <XStack width={300} alignItems="center" space="$4">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <StyledIndicator cat>
          <CheckIcon />
        </StyledIndicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}
