// Styled Button = @tamagui/ui's button behavior and parts + the default v2-look
// skin, assembled here in `tamagui`. @tamagui/ui deliberately ships no Button of
// its own: no two buttons are alike, so it exposes `useButton` and the frame,
// text, and icon parts and lets a skin decide the rest. This is the single skin
// definition — `tamagui` exports it as the default `Button`, and the shadcn
// registry item is generated from this exact file.
import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonIcon as ButtonBehaviorIcon,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  type ButtonIconProps as ButtonBehaviorIconProps,
  useButton,
} from '@tamagui/button'
import {
  createStyledContext,
  createStyledHOC,
  type GetProps,
  styled,
  Theme,
  type SizeName,
  type ThemeProps,
  withStaticProperties,
} from '@tamagui/core'
import { getThemedIconSize } from '@tamagui/helpers-tamagui'

export type ButtonSize = SizeName | boolean

const ButtonContext = createStyledContext<{ size?: ButtonSize }>({ size: 'md' })

const buttonFrameSize = {
  xs: { paddingInline: '2', paddingBlock: '1', borderRadius: 'sm', gap: '1' },
  sm: { paddingInline: '3', paddingBlock: '1.5', borderRadius: 'md', gap: '1.5' },
  md: { paddingInline: '4', paddingBlock: '2', borderRadius: 'md', gap: '2' },
  lg: { paddingInline: '6', paddingBlock: '2', borderRadius: 'md', gap: '2' },
  xl: { paddingInline: '8', paddingBlock: '2.5', borderRadius: 'lg', gap: '2.5' },
} as const

const buttonTextSize = {
  xs: { fontSize: 'xs', lineHeight: 'xs' },
  sm: { fontSize: 'sm', lineHeight: 'sm' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
  lg: { fontSize: 'base', lineHeight: 'base' },
  xl: { fontSize: 'lg', lineHeight: 'lg' },
} as const

// control heights (line height plus vertical padding) plus the frame's 1px
// border on each side: text buttons end up as tall as circular ones
const buttonHeight = {
  xs: 26,
  sm: 34,
  md: 38,
  lg: 42,
  xl: 50,
} as const

const buttonIconSize = {
  xs: 12,
  sm: 16,
  md: 16,
  lg: 16,
  xl: 20,
} as const

const resolveButtonSize = (size: ButtonSize | undefined): keyof typeof buttonHeight =>
  typeof size === 'string' && size in buttonHeight
    ? (size as keyof typeof buttonHeight)
    : 'md'

const ButtonFrameBase = styled(ButtonBehaviorFrame, {
  context: ButtonContext,
  displayName: 'ButtonFrame',
  className: 'tm-button',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover',
  borderStyle: 'solid',
  borderWidth: 1,
  cursor: 'web:pointer',
  opacity: 'press:0.7',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: {
      ...buttonFrameSize,
      true: buttonFrameSize.md,
    },

    circular: styled.dynamic<boolean>(),

    disabled: {
      true: {
        opacity: 0.35,
      },
    },

    variant: {
      outlined: {
        backgroundColor: 'transparent',
        borderColor: 'border-color',
      },
      quiet: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ButtonFrame = ButtonFrameBase.resolve((props) => {
  if (!props.circular) {
    const height = buttonHeight[resolveButtonSize(props.size as ButtonSize)]
    return {
      // keep text buttons at the same outer height as circular buttons
      minHeight: height,
      // `size` is a control preset, not square geometry. keep the frame's width
      // content-driven even if an outer styled layer also recognizes `size` as
      // the generic width/height shorthand.
      width: 'auto',
    }
  }
  // the control height plus the frame's 1px border on each side
  const side = buttonHeight[resolveButtonSize(props.size as ButtonSize)]
  return {
    borderRadius: 1000,
    paddingHorizontal: 0,
    height: side,
    maxHeight: side,
    maxWidth: side,
    minWidth: side,
    width: side,
  }
})

export const ButtonText = styled(ButtonBehaviorText, {
  context: ButtonContext,
  displayName: 'ButtonText',
  color: 'color',
  fontWeight: '600',
  userSelect: 'none',
  variants: {
    size: {
      ...buttonTextSize,
      true: buttonTextSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ButtonIcon = ({ size, ...props }: ButtonBehaviorIconProps) => {
  const context = ButtonContext.useStyledContext()

  return (
    <ButtonBehaviorIcon
      {...props}
      size={size ?? getThemedIconSize(buttonIconSize[resolveButtonSize(context?.size)])}
    />
  )
}

const ButtonComponent = createStyledHOC(
  ButtonFrame,
  function Button(
    props: ButtonBehaviorProps & { size?: ButtonSize; theme?: ThemeProps['name'] },
    ref
  ) {
    const { theme, ...buttonBehaviorProps } = props
    // ButtonFrame declares `context: ButtonContext`, so passing `size` through to
    // it is what publishes size to ButtonText and Button.Icon. The only reason
    // to resolve it here is the `icon` prop, which is themed before the frame
    // renders and so cannot read the context the frame is about to provide.
    const size = ((buttonBehaviorProps.size as ButtonSize | undefined) ??
      ButtonContext.useStyledContext()?.size ??
      'md') as ButtonSize
    const { props: buttonProps } = useButton(buttonBehaviorProps, {
      Text: ButtonText,
      iconSize: getThemedIconSize(
        typeof size === 'string' ? buttonIconSize[size] : buttonIconSize.md
      ),
    })

    const button = (
      <Theme name="level2">
        <ButtonFrame ref={ref} {...buttonProps} />
      </Theme>
    )

    return theme ? <Theme name={theme}>{button}</Theme> : button
  },
  { disableTheme: true }
)

export const Button = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Icon: ButtonIcon,
  Text: ButtonText,
})

export type ButtonProps = GetProps<typeof ButtonComponent>
