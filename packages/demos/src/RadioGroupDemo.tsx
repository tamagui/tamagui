import { Label, RadioGroup, SizeTokens, ThemeableStack, XStack, YStack } from 'tamagui'

export function RadioGroupDemo() {
  return (
    <RadioGroup name="form">
      <YStack w={300} ai="center" space="$3">
        <RadioGroupItemWithLabel size="$2" value="1" label="First value" />
        <RadioGroupItemWithLabel size="$3" value="2" label="Second value" />
        <RadioGroupItemWithLabel size="$4" value="3" label="Third value" />
        <RadioGroupItemWithLabel size="$5" value="4" label="Fourth value" />
      </YStack>
    </RadioGroup>
  )
}

function RadioGroupItemWithLabel(props: {
  size: SizeTokens
  value: string
  label: string
}) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack w={300} ai="center" space="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator h="60%" w="60%" backgrounded br={999} />
      </RadioGroup.Item>

      <Label size={props.size} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  )
}
