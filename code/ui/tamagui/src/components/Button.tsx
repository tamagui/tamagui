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
  createStyledHOC,
  type GetProps,
  getThemedIconSize,
  resolveSize,
  SizeContext,
  type SizeTokens,
  styled,
  Theme,
  type ThemeProps,
  type TokenSize,
  useButton,
  withStaticProperties,
} from '@tamagui/ui'

// SizeTokens includes `true`, which resolves through @tamagui/size's opt-in policy.
export type ButtonSize = SizeTokens

const buttonFrameSizeVariant = styled.dynamic<ButtonSize>((val, env) => {
  return {
    ...resolveSize(val, env).frame,
    // `size` is a control preset, not square geometry. keep the frame's width
    // content-driven even if an outer styled layer also recognizes `size` as
    // the generic width/height shorthand.
    width: 'auto',
  }
})

const buttonTextSizeVariant = styled.dynamic<ButtonSize>((val, env) => {
  return resolveSize(val, env).text
})

const ButtonFrameBase = styled(ButtonBehaviorFrame, {
  context: SizeContext,
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
    size: buttonFrameSizeVariant,

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
    size: true,
  },
})

export const ButtonFrame = ButtonFrameBase.resolve((props, env) => {
  if (!props.circular) return
  // the control height plus the frame's 1px border on each side
  const side = resolveSize(props.size as ButtonSize, env).controlHeight + 2
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
  context: SizeContext,
  displayName: 'ButtonText',
  color: 'color',
  fontWeight: '600',
  userSelect: 'none',
  variants: {
    size: buttonTextSizeVariant,
  } as const,
  defaultVariants: {
    size: true,
  },
})

export const ButtonIcon = ({ size, ...props }: ButtonBehaviorIconProps) => {
  const context = SizeContext.useStyledContext()

  return (
    <ButtonBehaviorIcon
      {...props}
      size={size ?? getThemedIconSize(context?.size ?? true)}
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
    // ButtonFrame declares `context: SizeContext`, so passing `size` through to
    // it is what publishes size to ButtonText and Button.Icon. The only reason
    // to resolve it here is the `icon` prop, which is themed before the frame
    // renders and so cannot read the context the frame is about to provide.
    const size = ((buttonBehaviorProps.size as TokenSize | undefined) ??
      SizeContext.useStyledContext()?.size ??
      true) as ButtonSize
    const { props: buttonProps } = useButton(buttonBehaviorProps, {
      Text: ButtonText,
      iconSize: getThemedIconSize(size),
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
