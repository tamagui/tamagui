import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { getFontSize } from '@tamagui/font-size'
import { getButtonSized } from '@tamagui/get-button-sized'
import { ColorProp, useCurrentColor, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import { SizableText, TextParentStyles, wrapChildrenInText } from '@tamagui/text'
import {
  ButtonNestingContext,
  GetProps,
  SizeTokens,
  TamaguiElement,
  ThemeableProps,
  getVariableValue,
  isRSC,
  spacedChildren,
  styled,
  themeable,
  useMediaPropsActive,
  useThemeName,
  withStaticProperties,
} from '@tamagui/web'
import {
  FunctionComponent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type ButtonIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null

type ButtonProps = Omit<TextParentStyles, 'TextComponent'> &
  GetProps<typeof ButtonFrame> &
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

const BUTTON_NAME = 'Button'

const ButtonFrame = styled(ThemeableStack, {
  name: BUTTON_NAME,
  tag: 'button',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        cursor: 'pointer',
        focusable: true,
        hoverTheme: true,
        pressTheme: true,
        backgrounded: true,
        borderWidth: 1,
        borderColor: 'transparent',

        pressStyle: {
          borderColor: 'transparent',
        },

        hoverStyle: {
          borderColor: 'transparent',
        },

        focusStyle: {
          borderColor: '$borderColorFocus',
          outlineColor: '$borderColorFocus',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },

    size: {
      '...size': getButtonSized,
    },

    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

const BUTTON_TEXT_NAME = 'ButtonText'
const ButtonTextFrame = styled(SizableText, {
  name: BUTTON_TEXT_NAME,

  variants: {
    unstyled: {
      false: {
        userSelect: 'none',
        cursor: 'pointer',
        // flexGrow 1 leads to inconsistent native style where text pushes to start of view
        flexGrow: 0,
        flexShrink: 1,
        ellipse: true,
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

type ScopedProps<P> = P & { __scopeButton?: Scope }
const [createButtonContext, createButtonScope] = createContextScope('Button')

type ButtonContextValue = {
  size: SizeTokens
  color: ColorProp

  // used to keep backward compat with the new Button.Text api
  hasTextComponent: boolean
  registerButtonText: () => () => void
}

const [ButtonProvider, useButtonContext] =
  createButtonContext<ButtonContextValue>('Button')

const ButtonTextComponent = ButtonTextFrame.extractable(
  forwardRef<TamaguiElement, ScopedProps<GetProps<typeof ButtonTextFrame>>>(
    (props, ref) => {
      const context = useButtonContext(BUTTON_TEXT_NAME, props.__scopeButton)

      useEffect(() => {
        const unregister = context.registerButtonText()
        return () => unregister()
      }, [context.registerButtonText])

      return <ButtonTextFrame size={props.size ?? context.size} {...props} ref={ref} />
    }
  )
)

const BUTTON_ICON_NAME = 'ButtonIcon'

const ButtonIcon = (
  props: ScopedProps<{
    children: React.ReactNode
    scaleIcon?: number
  }>
) => {
  const { children, scaleIcon = 1 } = props
  const context = useButtonContext(BUTTON_ICON_NAME, props.__scopeButton)

  const size = context.size
  const color = context.color

  const iconSize = (typeof size === 'number' ? size * 0.5 : getFontSize(size)) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  return getThemedIcon(children)
}

const ButtonComponent = forwardRef<TamaguiElement, ScopedProps<ButtonProps>>(
  function Button(props, ref) {
    const { props: buttonProps } = useButton(props)
    const [buttonTextCount, setButtonTextCount] = useState(0)

    const registerButtonText = useCallback(() => {
      setButtonTextCount((prev) => prev + 1)
      return () => setButtonTextCount((prev) => prev - 1)
    }, [setButtonTextCount])

    const hasTextComponent = buttonTextCount > 0

    return (
      <ButtonProvider
        scope={props.__scopeButton}
        color={props.color}
        hasTextComponent={hasTextComponent}
        size={props.size ?? '$true'}
        registerButtonText={registerButtonText}
      >
        <ButtonFrame {...(hasTextComponent ? props : buttonProps)} ref={ref} />
      </ButtonProvider>
    )
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
  ButtonFrame.extractable(
    themeable(ButtonComponent, ButtonFrame.staticConfig),
    buttonStaticConfig
  ),
  {
    Text: ButtonTextComponent,
    Icon: ButtonIcon,
  }
)

function useButton(
  propsIn: ButtonProps,
  { Text = ButtonTextFrame }: { Text: any } = { Text: ButtonTextFrame }
) {
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
    unstyled = false,
    textProps,

    ...rest
  } = propsIn

  const isNested = isRSC ? false : useContext(ButtonNestingContext)
  const propsActive = useMediaPropsActive(propsIn)
  const size = propsActive.size || '$true'
  const iconSize = (typeof size === 'number' ? size * 0.5 : getFontSize(size)) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const spaceSize = propsActive.space ?? getVariableValue(iconSize) * scaleSpace
  const contents = wrapChildrenInText(
    Text,
    propsActive,
    Text === ButtonTextFrame
      ? {
          unstyled,
        }
      : undefined
  )
  const inner = spacedChildren({
    // a bit arbitrary but scaling to font size is necessary so long as button does
    space: spaceSize,
    spaceFlex,
    separator,
    direction:
      propsActive.flexDirection === 'column' ||
      propsActive.flexDirection === 'column-reverse'
        ? 'vertical'
        : 'horizontal',
    children: [themedIcon, ...contents, themedIconAfter],
  })

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
    unstyled,
    tag,
    ...rest,
    children: isRSC ? (
      inner
    ) : (
      <ButtonNestingContext.Provider value={true}>{inner}</ButtonNestingContext.Provider>
    ),
  }

  return {
    spaceSize,
    isNested,
    props,
  }
}

export {
  createButtonScope,
  Button,

  // legacy api
  useButton,
  buttonStaticConfig,
  ButtonFrame,
  ButtonTextFrame as ButtonText,
}

export type { ButtonProps }
