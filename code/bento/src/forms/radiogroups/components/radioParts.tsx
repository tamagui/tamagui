import { RadioGroup as TRadioGroup, styled, View, withStaticProperties } from 'tamagui'

// tamagui's styled RadioGroup carries the skin and the size ladder; an empty
// ring needs more contrast than a card edge to read as a control
const RadioGroupItem = styled(TRadioGroup.Item, {
  borderColor: 'color-8 hover:color-9',
})

export const RadioGroup = withStaticProperties(TRadioGroup, { Item: RadioGroupItem })

export const Card = styled(View, {
  cursor: 'pointer',
  width: '100%',
  rounded: '4',
  p: '3',
  bg: 'background hover:background-hover focus:background-focus press:background-press',
  borderColor:
    'border-color hover:border-color-hover focus:border-color-focus press:border-color-press',
  borderWidth: 1,
  variants: {
    active: {
      true: {
        bg: 'background-focus',
        borderColor: 'border-color-focus',
      },
    },
  } as const,
})
