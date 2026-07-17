import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ButtonNestingContext } from '@tamagui/stacks'
import type { TextContextStyles, TextParentStyles } from '@tamagui/text'
import { wrapChildrenInText } from '@tamagui/text'
import type { GetProps } from '@tamagui/web'
import {
  createStyledContext,
  createStyledHOC,
  styled,
  Text,
  useProps,
  View,
  withStaticProperties,
} from '@tamagui/web'
import type { FunctionComponent, JSX, ReactNode } from 'react'
import { useContext } from 'react'

const buttonContextKeys = [
  'color',
  'ellipsis',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'maxFontSizeMultiplier',
  'textAlign',
] as const

export const ButtonContext = createStyledContext<
  TextContextStyles,
  (typeof buttonContextKeys)[number]
>(
  {
    color: undefined,
    ellipsis: undefined,
    fontFamily: undefined,
    fontSize: undefined,
    fontStyle: undefined,
    fontWeight: undefined,
    letterSpacing: undefined,
    maxFontSizeMultiplier: undefined,
    textAlign: undefined,
  },
  {
    keys: buttonContextKeys,
  }
)

export const ButtonFrame = styled(View, {
  context: ButtonContext,
  name: 'ButtonFrame',
  role: 'button',
  render: <button type="button" />,
  tabIndex: 0,
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'center',

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,
})

export const ButtonText = styled(Text, {
  context: ButtonContext,
  name: 'ButtonText',
  // flexGrow 1 pushes text to the start of its parent on native
  flexGrow: 0,
  flexShrink: 1,
})

export type ButtonIconProps = {
  children: ReactNode
  color?: TextContextStyles['color']
  scaleIcon?: number
  size?: number
}

export const ButtonIcon = ({ children, color, scaleIcon = 1, size }: ButtonIconProps) => {
  const styledContext = ButtonContext.useStyledContext()
  const iconColor = color ?? styledContext?.color
  const getThemedIcon = useGetThemedIcon({
    color: iconColor === 'unset' || typeof iconColor === 'number' ? undefined : iconColor,
    size: size === undefined ? undefined : size * scaleIcon,
  })

  return getThemedIcon(children)
}

type ButtonIconInput =
  | JSX.Element
  | FunctionComponent<{ color?: any; size?: any }>
  | ((props: { color?: any; size?: any }) => ReactNode)
  | null

export type ButtonBehaviorProps = TextParentStyles & {
  icon?: ButtonIconInput
  iconAfter?: ButtonIconInput
  iconSize?: number
  scaleIcon?: number

  // native button html props
  type?: 'submit' | 'reset' | 'button'
  form?: string
  formAction?: string
  formEncType?: string
  formMethod?: string
  formNoValidate?: boolean
  formTarget?: string
  name?: string
  value?: string | readonly string[] | number
}

export type UseButtonOptions = {
  Text?: any
  iconColor?: TextContextStyles['color']
  iconSize?: number
  textProps?: Record<string, unknown>
}

export function useButton<Props extends ButtonBehaviorProps>(
  propsIn: Props,
  {
    Text = ButtonText,
    iconColor: iconColorOption,
    iconSize: iconSizeOption,
    textProps: textPropsOption,
  }: UseButtonOptions = {}
) {
  const isNested = useContext(ButtonNestingContext)
  const styledContext = ButtonContext.useStyledContext()
  const processedProps = useProps(propsIn, {
    noNormalize: true,
    noExpand: true,
  }) as Props & {
    accessibilityRole?: string
    children?: ReactNode
    color?: TextContextStyles['color']
    disabled?: boolean
    render?: unknown
    role?: string
    size?: unknown
  }

  const {
    children,
    color,
    disabled,
    ellipsis,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    icon,
    iconAfter,
    iconSize,
    letterSpacing,
    maxFontSizeMultiplier,
    noTextWrap,
    render,
    scaleIcon = 1,
    textAlign,
    textProps,
    ...restProps
  } = processedProps

  const contextColor = color ?? styledContext?.color
  const iconColor = iconColorOption ?? contextColor
  const resolvedIconSize = iconSize ?? iconSizeOption
  const getThemedIcon = useGetThemedIcon({
    color: iconColor === 'unset' || typeof iconColor === 'number' ? undefined : iconColor,
    size: resolvedIconSize === undefined ? undefined : resolvedIconSize * scaleIcon,
  })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map((item) => {
    return item ? getThemedIcon(item) : null
  })

  const textContext: TextContextStyles = {
    color: contextColor,
    ellipsis: ellipsis ?? styledContext?.ellipsis,
    fontFamily: fontFamily ?? styledContext?.fontFamily,
    fontSize: fontSize ?? styledContext?.fontSize,
    fontStyle: fontStyle ?? styledContext?.fontStyle,
    fontWeight: fontWeight ?? styledContext?.fontWeight,
    letterSpacing: letterSpacing ?? styledContext?.letterSpacing,
    maxFontSizeMultiplier: maxFontSizeMultiplier ?? styledContext?.maxFontSizeMultiplier,
    textAlign: textAlign ?? styledContext?.textAlign,
  }
  const wrappedChildren = wrapChildrenInText(
    Text,
    {
      children,
      ...textContext,
      noTextWrap,
      textProps,
    },
    {
      ...textPropsOption,
      ...(processedProps.size === undefined ? null : { size: processedProps.size }),
    }
  )
  const resolvedRender =
    render ??
    (isNested ? (
      'span'
    ) : processedProps.accessibilityRole === 'link' || processedProps.role === 'link' ? (
      'a'
    ) : disabled ? (
      <button type="button" disabled />
    ) : undefined)

  const props = {
    ...restProps,
    ...(disabled && {
      'aria-disabled': true,
      disabled: true,
      tabIndex: -1,
    }),
    ...(resolvedRender === undefined ? null : { render: resolvedRender }),
    ...(isNested && {
      // a nested Button is a presentation part, not a control: strip the
      // interactive semantics so we never place a focusable role=button (with
      // its own press/keyboard handlers) inside the outer native <button>. that
      // nesting is invalid html, adds an extra focus stop, and bubbles
      // activation to the outer control. resolvedRender already makes it a span.
      role: 'none',
      tabIndex: -1,
      'aria-disabled': undefined,
      disabled: undefined,
      onPress: undefined,
      onPressIn: undefined,
      onPressOut: undefined,
      onLongPress: undefined,
      onClick: undefined,
      onKeyDown: undefined,
      onKeyUp: undefined,
    }),
    children: (
      <ButtonNestingContext.Provider value={true}>
        <ButtonContext.Provider {...textContext}>
          {themedIcon}
          {wrappedChildren}
          {themedIconAfter}
        </ButtonContext.Provider>
      </ButtonNestingContext.Provider>
    ),
  } as Props

  return {
    isNested,
    props,
  }
}

const ButtonComponent = createStyledHOC(ButtonFrame)<ButtonBehaviorProps>(
  function Button(props, ref) {
    const { props: buttonProps } = useButton(props)

    return <ButtonFrame ref={ref} {...buttonProps} />
  }
)

export const Button = withStaticProperties(ButtonComponent, {
  Apply: ButtonContext.Provider,
  Frame: ButtonFrame,
  Icon: ButtonIcon,
  Text: ButtonText,
})

export type ButtonProps = GetProps<typeof ButtonComponent>
