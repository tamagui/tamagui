import type { SizeTokens } from 'tamagui'
import { Label, RadioGroup, XStack, YStack } from 'tamagui'

export function RadioGroupDemo() {
  return (
    <RadioGroup aria-labelledby="Select one item" defaultValue="3" name="form">
      <YStack width={300} alignItems="center" space="$2">
        <RadioGroupItemWithLabel size="$3" value="2" label="Second value" />
        <RadioGroupItemWithLabel size="$4" value="3" label="Third value" />
        <RadioGroupItemWithLabel size="$5" value="4" label="Fourth value" />
      </YStack>
    </RadioGroup>
  )
}

export function RadioGroupItemWithLabel(props: {
  size: SizeTokens
  value: string
  label: string
}) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack width={300} alignItems="center" space="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={props.size} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  )
}
