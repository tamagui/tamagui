import { Button, ButtonFrame, ButtonText, GetProps, styled, useButton } from 'tamagui'

const Frame = styled(ButtonFrame, {
  backgroundColor: 'red',
})

const Text = styled(ButtonText, {
  fontSize: '$2',
  lineHeight: '$3',
  textTransform: 'uppercase',
  marginTop: 0,
  marginBottom: 0,
})

const ButtonStyled = styled(Button, {})

export const ButtonCustom = Frame.styleable((props, ref) => {
  const { props: buttonProps } = useButton(props as any, { Text })

  return (
    <>
      <Frame ref={ref} {...buttonProps} />

      {/* saw an issue where defaultProps gets merged back onto styled(styleable(styled())) causing flexDir column overwriting row */}
      <Button testID="button" width={200}>
        test
      </Button>
      <ButtonStyled testID="button-styled" width={200}>
        test
      </ButtonStyled>
    </>
  ) as any
})
