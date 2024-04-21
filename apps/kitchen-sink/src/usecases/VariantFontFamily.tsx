import { Text, styled } from 'tamagui'

export const Heading = styled(
  Text,
  {
    color: '$color',

    variants: {
      type: {
        myVariant: {
          fontFamily: '$body',
          fontSize: 20,
          lh: '$10',
          fow: '$2',
        },
      },
    } as const,
  },
  {
    name: 'Heading',
  }
)

export function VariantFontFamily() {
  return (
    <Heading data-testid="heading" type="myVariant" fontSize="$1">
      H1
    </Heading>
  )
}
