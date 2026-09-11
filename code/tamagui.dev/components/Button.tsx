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
} from 'tamagui'

export type ButtonSize = SizeTokens

const buttonFrameSizeVariant = styled.dynamic<ButtonSize>((val, env) => {
  return resolveSize(val, env).frame
})

const buttonTextSizeVariant = styled.dynamic<ButtonSize>((val, env) => {
  return resolveSize(val, env).text
})

const ButtonFrameBase = styled(ButtonBehaviorFrame, {
  context: SizeContext,
  displayName: 'SiteButtonFrame',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'transparent hover:border-color-hover',
  borderStyle: 'solid',
  borderWidth: 1,
  cursor: 'web:pointer',
  opacity: 'press:0.7',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: styled.dynamic<ButtonSize>(),

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
  if (!props.circular) {
    return buttonFrameSizeVariant((props.size as ButtonSize) ?? true, env)
  }
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
  displayName: 'SiteButtonText',
  color: 'color',
  fontWeight: '400',
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
    props: ButtonBehaviorProps & {
      size?: ButtonSize
      theme?: ThemeProps['name']
    },
    ref
  ) {
    const { theme, ...buttonBehaviorProps } = props
    const contextSize = SizeContext.useStyledContext()?.size
    const size = ((buttonBehaviorProps.size as TokenSize | undefined) ??
      contextSize ??
      true) as ButtonSize
    const sizedProps = { size, ...buttonBehaviorProps }
    const { props: buttonProps } = useButton(sizedProps, {
      Text: ButtonText,
      iconSize: getThemedIconSize(size),
    })

    const frame = (
      <Theme name="Button" forceClassName>
        <ButtonFrame ref={ref} {...buttonProps} />
      </Theme>
    )

    const button = <SizeContext.Provider size={size}>{frame}</SizeContext.Provider>
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
