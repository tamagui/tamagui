import { getFontSize } from '@tamagui/font-size'
import { ColorProp, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import {
  GetProps,
  SizeTokens,
  TamaguiElement,
  styled,
  themeable,
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

const ButtonTextComponent = ButtonTextFrame.extractable(
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

const buttonStaticConfig = {
  inlineProps: new Set([
    // text props go here (can't really optimize them, but we never fully extract button anyway)
    // may be able to remove this entirely, as the compiler / runtime have gotten better
    'color',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'fontStyle',
    'letterSpacing',
    'textAlign',
    'unstyled',
  ]),
}

const Button = withStaticProperties(
  // ButtonComponent,
  ButtonFrame.extractable(ButtonComponent),
  {
    Text: ButtonTextComponent,
    Icon: ButtonIcon,
  }
)

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
  buttonStaticConfig,
}

export type { ButtonProps }
