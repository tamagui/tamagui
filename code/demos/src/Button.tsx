import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonIcon as ButtonBehaviorIcon,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  type ButtonIconProps as ButtonBehaviorIconProps,
  createStyledHOC,
  type GetProps,
  getThemedIconSize,
  getVariableValue,
  resolveTokenSize,
  SizeContext,
  type SizeTokens,
  styled,
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
    gap: Math.round(getVariableValue(frame.size) * 0.2),
    height: frame.size,
    paddingHorizontal: frame.space,
  }
}

const buttonTextSizeVariant = (val: ButtonSize, extras: VariantSpreadExtras<any>) => {
  const { text } = resolveTokenSize(val, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  return {
    fontSize: text.fontSize,
    ...(text.lineHeight !== undefined && { lineHeight: text.lineHeight }),
  }
}

export const ButtonFrame = styled(ButtonBehaviorFrame, {
  context: SizeContext,
  name: 'DemoButtonFrame',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover',
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
  name: 'DemoButtonText',
  color: 'color',
  fontWeight: '600',
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
  function Button(props: ButtonBehaviorProps & { size?: ButtonSize }, ref) {
    const contextSize = SizeContext.useStyledContext()?.size
    const size = ((props.size as TokenSize | undefined) ??
      contextSize ??
      true) as ButtonSize
    const sizedProps = { size, ...props }
    const { props: buttonProps } = useButton(sizedProps, {
      Text: ButtonText,
      iconSize: getThemedIconSize(size),
    })

    return (
      <SizeContext.Provider size={size}>
        <ButtonFrame ref={ref} {...buttonProps} />
      </SizeContext.Provider>
    )
  }
)

export const Button = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Icon: ButtonIcon,
  Text: ButtonText,
})

export type ButtonProps = GetProps<typeof ButtonComponent>
