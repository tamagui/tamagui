import type { GetProps, ButtonProps as TamaguiButtonProps } from '@tamagui/ui'
import {
  Button,
  styled,
  useButton,
  useTheme,
  useThemeName,
} from '@tamagui/ui'

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
    const { props } = useButton(propsIn, { Text: CustomButtonText })
    return <CustomButtonFrame {...props} ref={ref} />
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

export const CustomButton2 = CustomButtonFrame.styleable<CustomButtonProps>(
  (propsIn, ref) => {
    const { props } = useButton(propsIn, { Text: CustomButtonText2 })
    return <CustomButtonFrame2 {...props} ref={ref} />
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
