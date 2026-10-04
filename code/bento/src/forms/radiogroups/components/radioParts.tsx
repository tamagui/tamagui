import { RadioGroup as TRadioGroup, styled, View, withStaticProperties } from 'tamagui'
import { tone } from '../../../tone'

// tamagui's styled RadioGroup carries the skin and the size ladder; an empty
// ring needs more contrast than a card edge to read as a control
const RadioGroupItem = styled(TRadioGroup.Item, {
  borderColor: `${tone.control} hover:color-9`,
})

export const RadioGroup = withStaticProperties(TRadioGroup, { Item: RadioGroupItem })

export const Card = styled(View, {
  cursor: 'pointer',
  width: '100%',
  rounded: '4',
  p: '3',
  bg: tone.surface,
  borderColor: `${tone.border} hover:color-6`,
  borderWidth: 1,
  variants: {
    active: {
      true: {
        borderColor: 'color-9',
      },
    },
  } as const,
})
