import type { RadioGroupSize } from 'tamagui'
import { Label, RadioGroup, Theme, XStack, YStack } from 'tamagui'

export function RadioGroupDemo() {
  return (
    <Theme name="level3">
      <RadioGroup aria-labelledby="Select one item" defaultValue="3" name="form">
        <YStack width={300} items="center" gap="2">
          <RadioGroupItemWithLabel size="sm" value="2" label="Second value" />
          <RadioGroupItemWithLabel size="md" value="3" label="Third value" />
          <RadioGroupItemWithLabel size="lg" value="4" label="Fourth value" />
        </YStack>
      </RadioGroup>
    </Theme>
  )
}

// the label speaks the font scale: these keys are the control font px
const radioLabelSize = {
  xs: '2',
  sm: '4',
  md: '4',
  lg: '5',
  xl: '6',
} as const

export function RadioGroupItemWithLabel(props: {
  size: RadioGroupSize
  value: string
  label: string
}) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack width={300} items="center" gap="4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label
        size={typeof props.size === 'string' ? radioLabelSize[props.size] : '4'}
        htmlFor={id}
      >
        {props.label}
      </Label>
    </XStack>
  )
}
