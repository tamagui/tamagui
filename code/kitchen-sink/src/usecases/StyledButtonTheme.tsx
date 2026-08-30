import type { GetProps } from 'tamagui'
import { createStyledHOC, styled, Theme, View } from 'tamagui'
import { Button } from '../components/Button'

const CustomButtonFrame = styled(Button, {})

const CustomButtonText = styled(Button.Text, {
  // ...
})

export type CustomButtonProps = GetProps<typeof CustomButtonFrame>

export const CustomButton = createStyledHOC(
  CustomButtonFrame,
  (propsIn: CustomButtonProps, ref) => {
    return (
      <CustomButtonFrame {...propsIn} ref={ref}>
        <CustomButtonText>{propsIn.children}</CustomButtonText>
      </CustomButtonFrame>
    )
  }
)

const CustomButtonFrame2 = styled(Button, {
  displayName: 'Test123',
  backgroundColor: 'black',
})

const CustomButtonText2 = styled(Button.Text, {
  // ...
})

export type CustomButtonProps2 = GetProps<typeof CustomButtonFrame2>

export const CustomButton2 = createStyledHOC(
  CustomButtonFrame2,
  (propsIn: CustomButtonProps2, ref) => {
    return (
      <CustomButtonFrame2 {...propsIn} ref={ref}>
        <CustomButtonText2>{propsIn.children}</CustomButtonText2>
      </CustomButtonFrame2>
    )
  }
)

export const StyledButtonTheme = () => (
  <Theme name="green">
    <Theme name="level2">
      <View id="test-theme-reference" backgroundColor="background" />
    </Theme>
    <CustomButton id="test">test2</CustomButton>

    <CustomButton2 id="test2">test2</CustomButton2>
  </Theme>
)
