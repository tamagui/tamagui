import { Text, styled } from 'tamagui'

export const Heading = styled(Text, {
  displayName: 'Heading',
  color: 'color',
  variants: {
    type: {
      myVariant: {
        fontFamily: 'body',
        fontSize: 20,
        lineHeight: '10',
        fontWeight: '2',
      },
    },
  } as const,
})

export function VariantFontFamily() {
  return (
    <Heading data-testid="heading" type="myVariant" fontSize="1">
      H1
    </Heading>
  )
}
