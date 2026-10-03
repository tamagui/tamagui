import { Label, XStack } from 'tamagui'
import { RadioGroup, type SiteRadioSize } from '~/components/RadioGroup'

// the site fonts are numeric: these keys are the old recipe's font px
const labelFontSize = {
  xs: '2',
  sm: '3',
  md: '4',
  lg: '5',
  xl: '6',
} as const

export function RadioGroupItemWithLabel(props: {
  size: SiteRadioSize
  value: string
  label: string
}) {
  const id = `radiogroup-${props.value}`
  const size = typeof props.size === 'string' ? props.size : 'md'
  return (
    <XStack pr="4" items="center" gap="4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={labelFontSize[size]} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  )
}
