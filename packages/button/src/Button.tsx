import { getFontSize } from '@tamagui/font-size'
import { getButtonSized } from '@tamagui/get-button-sized'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import {
  SizableText,
  TextContextStyles,
  TextParentStyles,
  wrapChildrenInText,
} from '@tamagui/text'
import {
  FontSizeTokens,
  GetProps,
  SizeTokens,
  ThemeableProps,
  createStyledContext,
  getVariableValue,
  spacedChildren,
  styled,
  useDidFinishSSR,
  useProps,
  withStaticProperties,
} from '@tamagui/web'
import { FunctionComponent, createContext, useContext } from 'react'

export const ButtonContext = createStyledContext<
  Partial<
    TextContextStyles & {
      size: SizeTokens
    }
  >
>({
  // keeping these here means they work with styled() passing down color to text
  color: undefined,
  ellipse: undefined,
  fontFamily: undefined,
  fontSize: undefined,
  fontStyle: undefined,
  fontWeight: undefined,
  letterSpacing: undefined,
  maxFontSizeMultiplier: undefined,
  size: undefined,
  textAlign: undefined,
})

type ButtonIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null

type ButtonExtraProps = TextParentStyles &
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
     * remove default styles
     */
    unstyled?: boolean
  }

type ButtonProps = ButtonExtraProps & GetProps<typeof ButtonFrame>

const BUTTON_NAME = 'Button'

const ButtonFrame = styled(ThemeableStack, {
  name: BUTTON_NAME,
  tag: 'button',
  context: ButtonContext,
  focusable: true,
  role: 'button',

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

        focusStyle: {
          outlineColor: '$borderColorFocus',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },

    variant: {
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '$borderColor',

        hoverStyle: {
          backgroundColor: 'transparent',
          borderColor: '$borderColorHover',
        },

        pressStyle: {
          backgroundColor: 'transparent',
          borderColor: '$borderColorPress',
        },

        focusStyle: {
          backgroundColor: 'transparent',
          borderColor: '$borderColorFocus',
        },
      },
    },

    size: {
      '...size': getButtonSized,
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

const ButtonText = styled(SizableText, {
  name: 'Button',
  context: ButtonContext,

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

const ButtonIcon = (props: { children: React.ReactNode; scaleIcon?: number }) => {
  const { children, scaleIcon = 1 } = props
  const { size, color } = useContext(ButtonContext)

  const iconSize =
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)) *
    scaleIcon

  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
  return getThemedIcon(children)
}

const ButtonComponent = ButtonFrame.styleable<ButtonExtraProps>(function Button(
  props,
  ref
) {
  const { props: buttonProps } = useButton(props)
  return <ButtonFrame {...buttonProps} ref={ref} />
})

/**
 * @deprecated Instead of useButton, see the Button docs for the newer and much improved Advanced customization pattern: https://tamagui.dev/docs/components/button
 */
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

const Button = withStaticProperties(ButtonComponent, {
  Text: ButtonText,
  Icon: ButtonIcon,
})

export const ButtonNestingContext = createContext(false)

/**
 * @deprecated Instead of useButton, see the Button docs for the newer and much improved Advanced customization pattern: https://tamagui.dev/docs/components/button
 */
function useButton<Props extends ButtonProps>(
  { textProps, ...propsIn }: Props,
  { Text = Button.Text }: { Text: any } = { Text: Button.Text }
) {
  const isNested = useContext(ButtonNestingContext)
  const didFinishSSR = useDidFinishSSR()
  const propsActive = useProps(propsIn) as any as ButtonProps

  // careful not to destructure and re-order props, order is important
  const {
    icon,
    iconAfter,
    space,
    spaceFlex,
    scaleIcon = 1,
    scaleSpace = 0.66,
    separator,
    noTextWrap,
    fontFamily,
    fontSize,
  } = propsActive

  const size = propsActive.size || (propsActive.unstyled ? undefined : '$true')

  const iconSize =
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)) *
    scaleIcon

  const getThemedIcon = useGetThemedIcon({
    size: iconSize,
    color: propsActive.color as any,
  })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const spaceSize = space ?? getVariableValue(iconSize) * scaleSpace
  const contents = noTextWrap
    ? [propsIn.children]
    : wrapChildrenInText(
        Text,
        { children: propsIn.children, fontFamily, fontSize, textProps },
        Text === ButtonText && propsActive.unstyled !== true
          ? {
              unstyled: false,
              size,
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
    propsActive.accessibilityRole === 'link'
    ? 'a'
    : undefined

  // remove the ones we used here
  const { iconAfter: _1, icon: _2, noTextWrap: _3, ...restProps } = propsIn

  const props = {
    size,
    ...(propsIn.disabled && {
      // in rnw - false still has keyboard tabIndex, undefined = not actually focusable
      focusable: undefined,
      // even with tabIndex unset, it will keep focusStyle on web so disable it here
      focusStyle: {
        borderColor: '$background',
      },
    }),
    ...(tag && {
      tag,
    }),
    ...restProps,
    children: (
      <ButtonNestingContext.Provider value={true}>{inner}</ButtonNestingContext.Provider>
    ),
    // forces it to be a runtime pressStyle so it passes through context text colors
    disableClassName: didFinishSSR,
  } as Props

  return {
    spaceSize,
    isNested,
    props,
  }
}

export {
  Button,
  ButtonFrame,
  ButtonIcon,
  ButtonText,
  buttonStaticConfig,
  // legacy
  useButton,
}
export type { ButtonProps }
