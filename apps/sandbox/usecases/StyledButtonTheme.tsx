import {
  Button,
  ButtonFrame,
  ButtonText,
  GetProps,
  ButtonProps as TamaguiButtonProps,
  styled,
  useButton,
} from 'tamagui'

const CustomButtonFrame = styled(ButtonFrame, {
  // ...
})

console.log('CustomButtonFrame', CustomButtonFrame)

const CustomButtonText = styled(ButtonText, {
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

export default () => (
  <>
    <Button id="test2" theme="green">
      test2
    </Button>
  </>
)
