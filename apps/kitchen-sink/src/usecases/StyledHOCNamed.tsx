import { H1, Label, Text, styled } from 'tamagui'

const X1 = styled(Label, {
  name: 'MyLabel',
  color: '$color',
})

const X2 = styled(Text, {
  name: 'MyLabel',
  color: '$color',
})

export const StyledHOCNamed = () => {
  return (
    <>
      <X1 testID="text-named">hi</X1>
      <X2 testID="label-named">hi</X2>
    </>
  )
}
