import type { GetProps, ButtonProps as TamaguiButtonProps } from 'tamagui'
import { Button, styled, useTheme, useThemeName } from 'tamagui'

const CustomButtonFrame = styled(Button.Frame, {})

const CustomButtonText = styled(Button.Text, {
  // ...
})

type CustomButtonFrameProps = GetProps<typeof CustomButtonFrame>
type CustomButtonTextProps = GetProps<typeof CustomButtonText>

export type CustomButtonProps = TamaguiButtonProps &
  CustomButtonFrameProps &
  CustomButtonTextProps

export const CustomButton = CustomButtonFrame.styleable<CustomButtonProps>(
  (propsIn, ref) => {
    return (
      <CustomButtonFrame {...propsIn} ref={ref}>
        <CustomButtonText>{propsIn.children}</CustomButtonText>
      </CustomButtonFrame>
    )
  }
)

const CustomButtonFrame2 = styled(Button.Frame, {
  name: 'Test123',
  backgroundColor: 'black',
})

const CustomButtonText2 = styled(Button.Text, {
  // ...
})

type CustomButtonFrameProps2 = GetProps<typeof CustomButtonFrame>
type CustomButtonTextProps2 = GetProps<typeof CustomButtonText>

export type CustomButtonProps2 = TamaguiButtonProps &
  CustomButtonFrameProps2 &
  CustomButtonTextProps2

export const CustomButton2 = CustomButtonFrame2.styleable<CustomButtonProps2>(
  (propsIn, ref) => {
    return (
      <CustomButtonFrame2 {...propsIn} ref={ref}>
        <CustomButtonText2>{propsIn.children}</CustomButtonText2>
      </CustomButtonFrame2>
    )
  }
)

export const StyledButtonTheme = () => (
  <>
    <CustomButton id="test" theme="green">
      test2
    </CustomButton>

    <CustomButton2 id="test2" theme="green">
      test2
    </CustomButton2>
  </>
)
