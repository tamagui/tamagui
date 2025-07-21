import { Button, GetProps, styled } from '@tamagui/ui'

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

export const ButtonCustom = Button
