import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonIcon as ButtonBehaviorIcon,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  type ButtonIconProps as ButtonBehaviorIconProps,
  createStyledHOC,
  type GetProps,
  getThemedIconSize,
  resolveTokenSize,
  SizeContext,
  type SizeTokens,
  styled,
  Theme,
  type ThemeProps,
  type TokenSize,
  useButton,
  type VariantSpreadExtras,
  withStaticProperties,
} from 'tamagui'

export type ButtonSize = SizeTokens

const buttonFrameSizeVariant = (val: ButtonSize, extras: VariantSpreadExtras<any>) => {
  if (extras.props.circular) return
  const { frame } = resolveTokenSize(val, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  return {
    borderRadius: frame.radius,
    gap: frame.radius,
    height: frame.size,
    paddingHorizontal: frame.space,
  }
}

const buttonTextSizeVariant = (val: ButtonSize, extras: VariantSpreadExtras<any>) => {
  const isSilkscreen = String(extras.font?.family).includes('Silkscreen')
  const { text } = resolveTokenSize(val, {
    tokens: extras.tokens,
    font: extras.font!,
    policy: {
      size: 44,
      space: '4',
      radius: '4',
      fontSize: isSilkscreen ? '6' : '5',
    },
  })
  return {
    fontSize: text.fontSize,
    ...(text.lineHeight !== undefined && { lineHeight: text.lineHeight }),
  }
}

export const ButtonFrame = styled(ButtonBehaviorFrame, {
  context: SizeContext,
  name: 'SiteButtonFrame',
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
    size: {
      true: buttonFrameSizeVariant,
      Size: buttonFrameSizeVariant,
    },

    circular: {
      true: (_, extras: VariantSpreadExtras<any>) => {
        const { frame } = resolveTokenSize((extras.props.size as ButtonSize) ?? true, {
          tokens: extras.tokens,
          font: extras.font!,
        })
        return {
          borderRadius: 1000,
          paddingHorizontal: 0,
          height: frame.size,
          maxHeight: frame.size,
          maxWidth: frame.size,
          minWidth: frame.size,
          width: frame.size,
        }
      },
    },

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

export const ButtonText = styled(ButtonBehaviorText, {
  context: SizeContext,
  name: 'SiteButtonText',
  color: 'color',
  fontWeight: '400',
  userSelect: 'none',
  variants: {
    size: {
      true: buttonTextSizeVariant,
      Size: buttonTextSizeVariant,
    },
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
  }
)

export const Button = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Icon: ButtonIcon,
  Text: ButtonText,
})

export type ButtonProps = GetProps<typeof ButtonComponent>
