// Styled Button = the unstyled @tamagui/ui Button behavior primitive + the
// default v2-look skin, layered here in `tamagui`. This is the single skin
// definition: `tamagui` exports it as the default `Button`, `tamagui/unstyled`
// exposes the unstyled primitive, and the shadcn registry item is generated
// from this exact file (it imports @tamagui/ui and applies the skin — nothing
// duplicated).
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
  Theme,
  type ThemeProps,
  type TokenSize,
  useButton,
  type VariantSpreadExtras,
  withStaticProperties,
} from '@tamagui/ui'

// SizeTokens includes `true`, which resolves through @tamagui/size's opt-in policy.
export type ButtonSize = SizeTokens

const buttonFrameSizeVariant = (val: ButtonSize, extras: VariantSpreadExtras<any>) => {
  // Circular owns its square geometry in the circular variant below.
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
    // `size` is a control preset, not square geometry. keep the frame's width
    // content-driven even if an outer styled layer also recognizes `size` as
    // the generic width/height shorthand.
    width: 'auto',
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
  name: 'ButtonFrame',
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
  name: 'ButtonText',
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
  function Button(
    props: ButtonBehaviorProps & { size?: ButtonSize; theme?: ThemeProps['name'] },
    ref
  ) {
    const contextSize = SizeContext.useStyledContext()?.size
    const size = ((props.size as TokenSize | undefined) ??
      contextSize ??
      true) as ButtonSize
    // Size is the frame's baseline contribution. Appending it after
    // HOC-expanded style props would let the variant overwrite a direct
    // padding override from the caller.
    const sizedProps = { size, ...props }
    const { props: buttonProps } = useButton(sizedProps, {
      Text: ButtonText,
      iconSize: getThemedIconSize(size),
    })

    const { theme, ...frameProps } = buttonProps
    const frame = (
      <Theme name="level2">
        <ButtonFrame ref={ref} {...frameProps} />
      </Theme>
    )

    return (
      <SizeContext.Provider size={size}>
        {theme ? <Theme name={theme}>{frame}</Theme> : frame}
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
