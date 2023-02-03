import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { Checkbox, Label, SizeTokens, XStack, YStack } from 'tamagui'

export function CheckboxDemo() {
  return (
    <YStack w={300} ai="center" space="$3">
      <CheckboxWithLabel size="$2" />
      <CheckboxWithLabel size="$3" />
      <CheckboxWithLabel size="$4" />
      <CheckboxWithLabel size="$5" />
    </YStack>
  )
}

function CheckboxWithLabel(props: { size: SizeTokens }) {
  const id = `checkbox-${props.size.toString().slice(1)}`
  return (
    <XStack w={300} ai="center" space="$4">
      <Checkbox id={id} size={props.size}>
        <Checkbox.Indicator icon={<CheckIcon />} />
      </Checkbox>

      <Label size={props.size} htmlFor={id}>
        Accept terms and conditions
      </Label>
    </XStack>
  )
}
