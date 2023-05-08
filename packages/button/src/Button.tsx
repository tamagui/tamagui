import { getFontSize } from '@tamagui/font-size'
import { ColorProp, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import {
  GetProps,
  SizeTokens,
  styled,
  useMediaPropsActive,
  withStaticProperties,
} from '@tamagui/web'

const BUTTON_NAME = 'Button'

const ButtonFrame = styled(ThemeableStack, {
  name: BUTTON_NAME,
  tag: 'button',
  focusable: true,
})

const BUTTON_TEXT_NAME = 'ButtonText'
const ButtonTextFrame = styled(SizableText, {
  name: BUTTON_TEXT_NAME,
})

const ButtonTextComponent = ButtonTextFrame.styleable((props, ref) => {
  return <ButtonTextFrame {...props} ref={ref} />
})

const BUTTON_ICON_NAME = 'ButtonIcon'

const ButtonIcon = (props: {
  children: React.ReactNode
  size?: SizeTokens
  color?: ColorProp
}) => {
  const { children, color, size } = props

  const iconSize = typeof size === 'number' ? size * 0.5 : getFontSize(size)
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  return getThemedIcon(children)
}

const ButtonComponent = ButtonFrame.styleable((propsIn, ref) => {
  const propsActive = useMediaPropsActive(propsIn)

  return <ButtonFrame {...propsActive} ref={ref} />
})

const Button = withStaticProperties(ButtonComponent, {
  Text: ButtonTextComponent,
  Icon: ButtonIcon,
})

type ButtonProps = GetProps<typeof Button>

export {
  BUTTON_ICON_NAME,
  BUTTON_NAME,
  BUTTON_TEXT_NAME,
  Button,

  // simple api
  ButtonFrame,
  ButtonTextFrame as ButtonText,
  ButtonTextComponent,
}

export type { ButtonProps }
