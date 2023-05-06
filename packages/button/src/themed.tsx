import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { getFontSize } from '@tamagui/font-size'
import { getButtonSized } from '@tamagui/get-button-sized'
import { ColorProp, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { TextParentStyles, wrapChildrenInText } from '@tamagui/text'
import {
  ButtonNestingContext,
  CreateTamaguiProps,
  GetProps,
  SizeTokens,
  TamaguiElement,
  ThemeableProps,
  getConfig,
  getVariableValue,
  isRSC,
  spacedChildren,
  styled,
  themeable,
  useMediaPropsActive,
  withStaticProperties,
} from '@tamagui/web'
import {
  FunctionComponent,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  BUTTON_ICON_NAME,
  BUTTON_NAME,
  BUTTON_TEXT_NAME,
  Button as HeadlessButton,
} from './Button'

const ButtonFrame = styled(HeadlessButton, {
  name: BUTTON_NAME,
  variants: {
    unstyled: {
      false: {
        size: '$true',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        cursor: 'pointer',
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

type ButtonIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null

type ClassicButtonProps = {
  /**
   * add icon before, passes color and size automatically if Component
   *
   * NOTE: Only supported on the classic API.
   */
  icon?: IconProp
  /**
   * add icon after, passes color and size automatically if Component
   *
   * NOTE: Only supported on the classic API.
   */
  iconAfter?: IconProp
  /**
   * adjust icon relative to size
   *
   * NOTE: Only supported on the classic API.
   * @default 1
   */
  scaleIcon?: number
  /**
   * make the spacing elements flex
   *
   * NOTE: Only supported on the classic API.
   */
  spaceFlex?: number | boolean
  /**
   * adjust internal space relative to icon size
   *
   * NOTE: Only supported on the classic API.
   */
  scaleSpace?: number
} & Omit<TextParentStyles, 'TextComponent'>

type ButtonProps = GetProps<typeof ButtonFrame> &
  ThemeableProps &
  ClassicButtonProps & {
    /**
     * Used to override config's button API mode
     */
    forceButtonApi?: CreateTamaguiProps['buttonApi']
  }

const [createButtonContext, createButtonScope] = createContextScope(BUTTON_NAME)

type ButtonContextValue = {
  color: ColorProp
  size: SizeTokens
  /**
   * If true, means the button's using the composable composite API (whether via buttonApi: 'mixed' or buttonApi: 'composable')
   */
  usesComposableApi: boolean
  registerButtonText: () => () => void
}

const [ButtonProvider, useButtonContext] =
  createButtonContext<ButtonContextValue>('Button')
type ScopedProps<P> = P & { __scopeButton?: Scope }

const ButtonTextFrame = styled(HeadlessButton.Text, {
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

const ButtonText = ButtonTextFrame.extractable(
  forwardRef<TamaguiElement, ScopedProps<GetProps<typeof ButtonTextFrame>>>(
    (props, ref) => {
      const context = useButtonContext(BUTTON_TEXT_NAME, props.__scopeButton)

      useEffect(() => {
        const unregister = context.registerButtonText()
        return () => unregister()
      }, [context.registerButtonText])

      return (
        <ButtonTextFrame ref={ref} color={context.color} size={context.size} {...props}>
          {props.children}
        </ButtonTextFrame>
      )
    }
  )
)

type ButtonIconComponentProps = { children: React.ReactNode } & Pick<
  ButtonProps,
  'scaleIcon'
>

const ButtonIcon = (props: ScopedProps<ButtonIconComponentProps>) => {
  const { children, scaleIcon = 1 } = props
  const context = useButtonContext(BUTTON_ICON_NAME, props.__scopeButton)

  const size = context.size
  const color = context.color

  const iconSize = (typeof size === 'number' ? size * 0.5 : getFontSize(size)) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  return getThemedIcon(children)
}

const ButtonComponent = forwardRef<TamaguiElement, ScopedProps<ButtonProps>>(
  (props, ref) => {
    const buttonApi = props.forceButtonApi ?? getConfig().buttonApi ?? 'classic'
    const { props: buttonProps } = useButton(props)
    const [buttonTextCount, setButtonTextCount] = useState(0)

    const registerButtonText = useCallback(() => {
      if (buttonApi === 'classic') {
        console.warn(
          'You are using Button.Text with classic button API. Either remove Button.Text or use either `buttonApi: composable` or `mixed` in your tamagui config.'
        )
      }
      // if using composable, no need to register anything. it's the default.
      if (buttonApi === 'composable') return () => {}

      // using `mixed` at this point
      setButtonTextCount((prev) => prev + 1)
      return () => setButtonTextCount((prev) => prev - 1)
    }, [setButtonTextCount])

    const usesComposableApi =
      buttonApi === 'composable' || (buttonApi === 'mixed' && buttonTextCount > 0)

      console.log('render', buttonApi)
    return (
      <ButtonProvider
        scope={props.__scopeButton}
        size={props.size ?? '$true'}
        color={props.color}
        usesComposableApi={usesComposableApi}
        registerButtonText={registerButtonText}
      >
        <ButtonFrame ref={ref} {...buttonProps} />
      </ButtonProvider>
    )
  }
)

const Button = withStaticProperties(
  ButtonFrame.extractable(themeable(ButtonComponent, ButtonFrame.staticConfig)),
  {
    Text: ButtonText,
    Icon: ButtonIcon,
  }
)

/**
 * Hook only used with the classic button API.
 *
 */
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

export {
  Button,
  // old api
  ButtonFrame,
  ButtonTextFrame as ButtonText,
  buttonStaticConfig,
  createButtonScope,
  useButton,
}

export type { ButtonProps }
