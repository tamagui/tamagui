import { Button, createStyledHOC, styled, type GetProps } from 'tamagui'

type ButtonProps = GetProps<typeof Button>

const Frame = styled(Button.Frame, {
  backgroundColor: 'red',
})

const Text = styled(Button.Text, {
  fontSize: '$2',
  lineHeight: '$3',
  textTransform: 'uppercase',
  marginTop: 0,
  marginBottom: 0,
})

const ButtonStyled = styled(Button, {})

export const ButtonCustom = createStyledHOC(Frame)((props, ref) => {
  return (
    <>
      <Frame ref={ref} {...props} />

      {/* saw an issue where defaultProps gets merged back onto styled(createStyledHOC(styled())) causing flexDir column overwriting row */}
      <Button testID="button" width={200}>
        test
      </Button>
      <ButtonStyled testID="button-styled" width={200}>
        test
      </ButtonStyled>
    </>
  ) as any
})
