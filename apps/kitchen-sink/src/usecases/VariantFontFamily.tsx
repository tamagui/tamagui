import { Text, styled } from 'tamagui'

export const Heading = styled(Text, {
  name: 'Heading',
  color: '$color',

  variants: {
    type: {
      myVariant: {
        fontFamily: '$body',
        fontSize: 20,
        lh: '$24',
        fow: '$bold',
      },
    },
  } as const,
})

export function VariantFontFamily() {
  return (
    <Heading data-testid="heading" type="myVariant" fontSize="$1">
      H1
    </Heading>
  )
}
