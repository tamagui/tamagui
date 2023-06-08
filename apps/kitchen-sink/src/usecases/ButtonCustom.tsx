import { ButtonFrame, ButtonText, GetProps, styled, useButton } from 'tamagui'

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

type CustomButtonFrameProps = GetProps<typeof Frame>
type CustomButtonTextProps = GetProps<typeof Text>
type ButtonProps = CustomButtonFrameProps & CustomButtonTextProps

export const ButtonCustom = Frame.styleable<ButtonProps>((props, ref) => {
  // @ts-ignore
  const { props: buttonProps } = useButton(props, { Text })
  return <Frame ref={ref} {...buttonProps} />
})
