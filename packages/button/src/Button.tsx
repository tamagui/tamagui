import { getFontSize } from '@tamagui/font-size'
import { ColorProp, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import {
  GetProps,
  SizeTokens,
  TamaguiElement,
  styled,
  useMediaPropsActive,
  withStaticProperties,
} from '@tamagui/web'
import { forwardRef } from 'react'

const BUTTON_NAME = 'Button'

const ButtonFrame = styled(ThemeableStack, {
  name: BUTTON_NAME,
  tag: 'button',
})

const BUTTON_TEXT_NAME = 'ButtonText'
const ButtonTextFrame = styled(SizableText, {
  name: BUTTON_TEXT_NAME,
})

const ButtonTextComponent = ButtonTextFrame.styleable(
  forwardRef<TamaguiElement, GetProps<typeof ButtonTextFrame>>((props, ref) => {
    return <ButtonTextFrame {...props} ref={ref} />
  })
)

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

const ButtonComponent = forwardRef<TamaguiElement, GetProps<typeof ButtonFrame>>(
  function Button(propsIn, ref) {
    const propsActive = useMediaPropsActive(propsIn)

    return <ButtonFrame {...propsActive} ref={ref} />
  }
)

const Button = withStaticProperties(ButtonFrame.extractable(ButtonComponent), {
  Text: ButtonTextComponent,
  Icon: ButtonIcon,
})

type ButtonProps = GetProps<typeof Button>

export {
  BUTTON_ICON_NAME,
  BUTTON_NAME,
  BUTTON_TEXT_NAME,
  Button,

  // old api
  ButtonFrame,
  ButtonTextFrame as ButtonText,
  ButtonTextComponent,
}

export type { ButtonProps }
