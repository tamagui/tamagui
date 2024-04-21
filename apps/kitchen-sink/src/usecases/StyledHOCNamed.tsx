import { H1, Label, Text, styled } from 'tamagui'

const X1 = styled(
  Label,
  {
    color: '$color',
  },
  {
    name: 'MyLabel',
  }
)

const X2 = styled(
  Text,
  {
    color: '$color',
  },
  {
    name: 'MyLabel',
  }
)

export const StyledHOCNamed = () => {
  return (
    <>
      <X1 testID="text-named">hi</X1>
      <X2 testID="label-named">hi</X2>
    </>
  )
}
