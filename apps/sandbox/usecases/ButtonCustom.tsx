import { ButtonFrame, ButtonText, styled, useButton } from 'tamagui'

const Frame = styled(ButtonFrame, {
  backgroundColor: 'red',
})

const Text = styled(ButtonText, {
  color: 'green',
})

export const Button = Frame.styleable((props, ref) => {
  const { props: buttonProps } = useButton(props, { Text })
  return <Frame ref={ref} {...buttonProps} />
})
