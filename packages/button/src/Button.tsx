import { ThemeableStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import {
  ButtonNestingContext,
  GetProps,
  TamaguiElement,
  ThemeableProps,
  isRSC,
  styled,
  themeable,
  useMediaPropsActive,
  withStaticProperties,
} from '@tamagui/web'
import { FunctionComponent, forwardRef, useContext } from 'react'

type ButtonIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null

export type ButtonProps = GetProps<typeof ButtonFrame> &
  ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number
    /**
     *
     */
    unstyled?: boolean
  }

const NAME = 'Button'

export const ButtonFrame = styled(ThemeableStack, {
  name: NAME,
  tag: 'button',
})

export const ButtonText = styled(SizableText, {
  name: 'ButtonText',
})

const ButtonComponent = forwardRef<TamaguiElement, ButtonProps>(function Button(
  props,
  ref
) {
  const {
    props: { ...buttonProps },
  } = useButton(props)
  return <ButtonFrame {...buttonProps} ref={ref} />
})

export const Button = withStaticProperties(
  ButtonFrame.extractable(themeable(ButtonComponent, ButtonFrame.staticConfig)),
  { Text: ButtonText }
)
export function useButton(propsIn: ButtonProps) {
  // careful not to desctructure and re-order props, order is important
  const {
    children,
    icon,
    iconAfter,
    noTextWrap,
    theme: themeName,
    space,
    spaceFlex,
    scaleIcon = 1,
    scaleSpace = 0.66,
    separator,

    // text props
    color,
    fontWeight,
    letterSpacing,
    fontSize,
    fontFamily,
    fontStyle,
    textAlign,
    textProps,

    ...rest
  } = propsIn

  const isNested = isRSC ? false : useContext(ButtonNestingContext)
  const propsActive = useMediaPropsActive(propsIn)

  // fixes SSR issue + DOM nesting issue of not allowing button in button
  const tag = isNested
    ? 'span'
    : // defaults to <a /> when accessibilityRole = link
    // see https://github.com/tamagui/tamagui/issues/505
    propsIn.accessibilityRole === 'link'
    ? 'a'
    : undefined

  const props = {
    ...(propsActive.disabled && {
      // in rnw - false still has keyboard tabIndex, undefined = not actually focusable
      focusable: undefined,
      // even with tabIndex unset, it will keep focusStyle on web so disable it here
      focusStyle: {
        borderColor: '$background',
      },
    }),
    tag,
    ...rest,
    children: isRSC ? (
      children
    ) : (
      <ButtonNestingContext.Provider value={true}>
        {children}
      </ButtonNestingContext.Provider>
    ),
  }

  return {
    isNested,
    props,
  }
}
