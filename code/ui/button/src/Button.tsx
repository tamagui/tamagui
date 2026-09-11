import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ButtonNestingContext } from '@tamagui/stacks'
import type { TextParentStyles } from '@tamagui/text'
import { textParentProps, wrapChildrenInText } from '@tamagui/text'
import type { GetProps, TamaguiComponentPropsBaseBase } from '@tamagui/web'
import { splitStyleProps, styled, Text, View } from '@tamagui/web'
import type { FunctionComponent, JSX, ReactNode } from 'react'
import { useContext } from 'react'

export const ButtonFrame = styled(View, {
  // role is the cross-platform one; render only lands on web
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
  // flexGrow 1 pushes text to the start of its parent on native
  flexGrow: 0,
  flexShrink: 1,
})

export type ButtonIconProps = {
  children: ReactNode
  color?: string
  scaleIcon?: number
  size?: number
}

export const ButtonIcon = ({ children, color, scaleIcon = 1, size }: ButtonIconProps) => {
  const getThemedIcon = useGetThemedIcon({
    color,
    size: size === undefined ? undefined : size * scaleIcon,
  })

  return getThemedIcon(children)
}

type ButtonIconInput =
  | JSX.Element
  | FunctionComponent<{ color?: any; size?: any }>
  | ((props: { color?: any; size?: any }) => ReactNode)
  | null

/**
 * The props `useButton` reads and replaces. It hands the frame everything else
 * untouched, so this is exactly what its result omits.
 */
type ButtonConsumedProps = {
  children?: ReactNode
  disabled?: boolean
  render?: TamaguiComponentPropsBaseBase['render']

  icon?: ButtonIconInput
  iconAfter?: ButtonIconInput
  iconSize?: number
  scaleIcon?: number
}

/** passed straight through to the rendered `<button>` */
type ButtonHTMLProps = {
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

export type ButtonBehaviorProps = TextParentStyles & ButtonConsumedProps & ButtonHTMLProps

/**
 * What `useButton` returns: the caller's props minus the ones it consumed, plus
 * the ones it decides. Spelled out rather than cast, so a skin that spreads the
 * result onto a frame is type-checked on exactly what it will receive.
 */
export type UseButtonProps<Props> = Omit<
  Omit<Props, keyof TextParentStyles | keyof typeof textParentProps>,
  keyof ButtonConsumedProps
> & {
  children: ReactNode
  'aria-disabled'?: boolean
  disabled?: boolean
  render?: TamaguiComponentPropsBaseBase['render']
  tabIndex?: number
}

export type UseButtonOptions = {
  Text?: any
  iconColor?: string
  iconSize?: number
  textProps?: Record<string, unknown>
}

/**
 * Button behavior: icon theming, wrapping bare children in a text, and the html
 * nesting rules. Flat text styles are partitioned in one pass and handed to the
 * wrapped text, with no style resolution hook or text context.
 */
export function useButton<Props extends ButtonBehaviorProps>(
  propsIn: Props,
  {
    Text = ButtonText,
    iconColor,
    iconSize: iconSizeOption,
    textProps: textPropsOption,
  }: UseButtonOptions = {}
): { isNested: boolean; props: UseButtonProps<Props> } {
  const isNested = useContext(ButtonNestingContext)
  const [wrappedTextProps, buttonProps] = splitStyleProps(propsIn, {
    expandShorthands: true,
    filter: textParentProps,
  })

  const {
    children,
    disabled,
    icon,
    iconAfter,
    iconSize,
    render,
    scaleIcon = 1,
    ...frameProps
  } = buttonProps
  const { noTextWrap, textProps, ...textStyleProps } = wrappedTextProps

  const resolvedIconSize = iconSize ?? iconSizeOption
  const getThemedIcon = useGetThemedIcon({
    color: iconColor,
    size: resolvedIconSize === undefined ? undefined : resolvedIconSize * scaleIcon,
  })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map((item) => {
    return item ? getThemedIcon(item) : null
  })

  // adjacent text children join into one Text: `<Button>hi {name}</Button>` is
  // two children, and wrapping them separately lays them out with a gap,
  // ellipsizes per fragment, reads as fragments to assistive tech, and throws
  // "Text strings must be rendered within a <Text>" for a bare number on native
  const wrappedChildren = wrapChildrenInText(
    Text,
    { children, noTextWrap, textProps },
    { ...textPropsOption, ...textStyleProps }
  )

  const resolvedRender =
    render ??
    (isNested ? 'span' : disabled ? <button type="button" disabled /> : undefined)

  const resolvedProps = {
    ...frameProps,
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
        {themedIcon}
        {wrappedChildren}
        {themedIconAfter}
      </ButtonNestingContext.Provider>
    ),
  }

  return {
    isNested,
    props: resolvedProps,
  }
}

export type ButtonFrameProps = GetProps<typeof ButtonFrame>
