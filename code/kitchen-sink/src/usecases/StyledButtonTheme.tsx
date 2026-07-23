import type { GetProps } from 'tamagui'
import { createStyledHOC, styled, Theme, View } from 'tamagui'
import { Button, type ButtonProps } from '../components/Button'

const CustomButtonFrame = styled(Button, {})

const CustomButtonText = styled(Button.Text, {
  // ...
})

type CustomButtonFrameProps = GetProps<typeof CustomButtonFrame>
type CustomButtonTextProps = GetProps<typeof CustomButtonText>

export type CustomButtonProps = ButtonProps &
  CustomButtonFrameProps &
  CustomButtonTextProps

export const CustomButton = createStyledHOC(CustomButtonFrame)<CustomButtonProps>(
  (propsIn, ref) => {
    return (
      <CustomButtonFrame {...propsIn} ref={ref}>
        <CustomButtonText>{propsIn.children}</CustomButtonText>
      </CustomButtonFrame>
    )
  }
)

const CustomButtonFrame2 = styled(Button, {
  name: 'Test123',
  backgroundColor: 'black',
})

const CustomButtonText2 = styled(Button.Text, {
  // ...
})

type CustomButtonFrameProps2 = GetProps<typeof CustomButtonFrame>
type CustomButtonTextProps2 = GetProps<typeof CustomButtonText>

export type CustomButtonProps2 = ButtonProps &
  CustomButtonFrameProps2 &
  CustomButtonTextProps2

export const CustomButton2 = createStyledHOC(CustomButtonFrame2)<CustomButtonProps2>(
  (propsIn, ref) => {
    return (
      <CustomButtonFrame2 {...propsIn} ref={ref}>
        <CustomButtonText2>{propsIn.children}</CustomButtonText2>
      </CustomButtonFrame2>
    )
  }
)

export const StyledButtonTheme = () => (
  <Theme name="green">
    <View id="test-theme-reference" backgroundColor="$background" />
    <CustomButton id="test">test2</CustomButton>

    <CustomButton2 id="test2">test2</CustomButton2>
  </Theme>
)
