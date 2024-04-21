import { SizableText, styled } from 'tamagui'

const MyText = styled(
  SizableText,
  {
    tag: 'h1',
    size: '$4',
  },
  {
    name: 'H1',
  }
)

export const FontFamilyShorthand = () => (
  <>
    <MyText fontFamily="$heading" testID="fullform">
      is uppercase
    </MyText>
    <MyText ff="$heading" mt="$4" testID="shorthand">
      is uppercase
    </MyText>
  </>
)
