import type { SizeTokens} from 'tamagui';
import { Label, RadioGroup, XStack } from 'tamagui'

export function RadioGroupItemWithLabel(props: {
  size: SizeTokens
  value: string
  label: string
}) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack pr="$4" alignItems="center" space="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={props.size} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  )
}
