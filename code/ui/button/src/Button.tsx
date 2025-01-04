import { getFontSize } from '@tamagui/font-size'
import { getButtonSized } from '@tamagui/get-button-sized'
import { withStaticProperties } from '@tamagui/helpers'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ButtonNestingContext, ThemeableStack } from '@tamagui/stacks'
import type { TextContextStyles, TextParentStyles } from '@tamagui/text'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type { FontSizeTokens, GetProps, SizeTokens, ThemeableProps } from '@tamagui/web'
import {
  createStyledContext,
  getVariableValue,
  spacedChildren,
  styled,
  useProps,
} from '@tamagui/web'
import type { FunctionComponent } from 'react'
import { useContext } from 'react'

type ButtonVariant = 'outlined'

export const ButtonContext = createStyledContext<
  Partial<
    TextContextStyles & {
      size: SizeTokens
      variant?: ButtonVariant
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
  variant: undefined,
})

type ButtonIconProps = { color?: any; size?: any }
type IconProp =
  | JSX.Element
  | FunctionComponent<ButtonIconProps>
  | ((props: ButtonIconProps) => any)
  | null

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
  role: 'button',
  focusable: true,

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

        focusVisibleStyle: {
          outlineColor: '$outlineColor',
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

        focusVisibleStyle: {
          backgroundColor: 'transparent',
          borderColor: '$borderColorFocus',
        },
      },
    },

    size: {
      '...size': getButtonSized,
      ':number': getButtonSized,
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
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

const ButtonComponent = ButtonFrame.styleable<ButtonExtraProps>(
  function Button(props, ref) {
    // @ts-ignore
    const { props: buttonProps } = useButton(props)
    return <ButtonFrame data-disable-theme {...buttonProps} ref={ref} />
  }
)

const Button = withStaticProperties(ButtonComponent, {
  Text: ButtonText,
  Icon: ButtonIcon,
})

/**
 * @deprecated Instead of useButton, see the Button docs for the newer and much improved Advanced customization pattern: https://tamagui.dev/docs/components/button
 */
function useButton<Props extends ButtonProps>(
  { textProps, ...propsIn }: Props,
  { Text = Button.Text }: { Text: any } = { Text: Button.Text }
) {
  const isNested = useContext(ButtonNestingContext)
  const propsActive = useProps(propsIn, {
    noNormalize: true,
    noExpand: true,
  }) as any as ButtonProps

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
    fontWeight,
    fontStyle,
    letterSpacing,
    tag,
    ellipse,
    maxFontSizeMultiplier,

    ...restProps
  } = propsActive

  const size = propsActive.size || (propsActive.unstyled ? undefined : '$true')

  const color = propsActive.color as any

  const iconSize =
    (typeof size === 'number'
      ? size * 0.5
      : getFontSize(size as FontSizeTokens, {
          font: fontFamily?.[0] === '$' ? (fontFamily as any) : undefined,
        })) * scaleIcon

  const getThemedIcon = useGetThemedIcon({
    size: iconSize,
    color,
  })

  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const spaceSize = space ?? getVariableValue(iconSize) * scaleSpace
  const contents = noTextWrap
    ? [propsIn.children]
    : wrapChildrenInText(
        Text,
        {
          children: propsIn.children,
          fontFamily,
          fontSize,
          textProps,
          fontWeight,
          fontStyle,
          letterSpacing,
          ellipse,
          maxFontSizeMultiplier,
        },
        Text === ButtonText && propsActive.unstyled !== true
          ? {
              unstyled: process.env.TAMAGUI_HEADLESS === '1',
              size,
            }
          : undefined
      )

  const inner = spacedChildren({
    // a bit arbitrary but scaling to font size is necessary so long as button does
    space: spaceSize === false ? 0 : spaceSize == true ? '$true' : spaceSize,
    spaceFlex,
    ensureKeys: true,
    separator,
    direction:
      propsActive.flexDirection === 'column' ||
      propsActive.flexDirection === 'column-reverse'
        ? 'vertical'
        : 'horizontal',
    // for keys to stay the same we keep indices as similar a possible
    // so even if icons are undefined we still pass them
    children: [themedIcon, ...contents, themedIconAfter],
  })

  const props = {
    size,
    ...(propsIn.disabled && {
      // in rnw - false still has keyboard tabIndex, undefined = not actually focusable
      focusable: undefined,
      // even with tabIndex unset, it will keep focusVisibleStyle on web so disable it here
      focusVisibleStyle: {
        borderColor: '$background',
      },
    }),
    // fixes SSR issue + DOM nesting issue of not allowing button in button
    tag:
      tag ??
      (isNested
        ? 'span'
        : // defaults to <a /> when accessibilityRole = link
          // see https://github.com/tamagui/tamagui/issues/505
          propsActive.accessibilityRole === 'link' || propsActive.role === 'link'
          ? 'a'
          : 'button'),

    ...restProps,

    children: (
      <ButtonNestingContext.Provider value={true}>{inner}</ButtonNestingContext.Provider>
    ),
    // forces it to be a runtime pressStyle so it passes through context text colors
    disableClassName: true,
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
  // legacy
  useButton,
}
export type { ButtonProps }
