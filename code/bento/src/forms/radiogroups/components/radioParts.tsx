import { styled, View } from 'tamagui'

// tamagui's styled RadioGroup carries the skin and the size ladder
export { RadioGroup } from 'tamagui'

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
