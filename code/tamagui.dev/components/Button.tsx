import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonIcon as ButtonBehaviorIcon,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  type ButtonIconProps as ButtonBehaviorIconProps,
  createStyledHOC,
  type GetProps,
  createStyledContext,
  styled,
  Theme,
  type ThemeProps,
  useButton,
  withStaticProperties,
} from 'tamagui'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

const ButtonContext = createStyledContext<{ size?: ButtonSize }>({ size: 'md' })

// the site runs on v5 tokens, so the tables use v5 keys at the same px the
// old v5 size recipe resolved: xs is 12/19 type on 7/4 padding, sm 13/21 on
// 13/7, md 14/22 on 18/7, lg 16/25 on 24/10, xl 18/27 on 32/13
const buttonFrameSize = {
  xs: { paddingInline: '2', paddingBlock: '1-5', borderRadius: '2', gap: '1-5' },
  sm: { paddingInline: '3', paddingBlock: '2', borderRadius: '3', gap: '2' },
  md: { paddingInline: '4', paddingBlock: '2', borderRadius: '4', gap: '2' },
  lg: { paddingInline: '5', paddingBlock: '2-5', borderRadius: '5', gap: '2-5' },
  xl: { paddingInline: '6', paddingBlock: '3', borderRadius: '6', gap: '3' },
} as const

const buttonTextSize = {
  xs: { fontSize: '2', lineHeight: '2' },
  sm: { fontSize: '3', lineHeight: '3' },
  md: { fontSize: '4', lineHeight: '4' },
  lg: { fontSize: '5', lineHeight: '5' },
  xl: { fontSize: '6', lineHeight: '6' },
} as const

// control heights (line height plus vertical padding) plus the frame's 1px
// border on each side: text buttons end up as tall as circular ones
const buttonHeight = {
  xs: 29,
  sm: 37,
  md: 38,
  lg: 47,
  xl: 55,
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

    borderless: {
      true: {
        borderWidth: 0,
        borderStyle: 'none',
        borderColor: 'transparent hover:transparent focus:transparent press:transparent',
        outlineWidth: '0 focus-visible:0',
        outlineColor: 'transparent',
        outlineStyle: 'none',
        boxShadow: 'none',
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
  displayName: 'SiteButtonText',
  color: 'color',
  fontWeight: '400',
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
      size={size ?? buttonIconSize[resolveButtonSize(context?.size)]}
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
    // ButtonFrame declares `context: ButtonContext`, so passing `size` through to
    // it is what publishes size to ButtonText and Button.Icon. The only reason
    // to resolve it here is the `icon` prop, which is themed before the frame
    // renders and so cannot read the context the frame is about to provide.
    const size = ((buttonBehaviorProps.size as ButtonSize | undefined) ??
      ButtonContext.useStyledContext()?.size ??
      'md') as ButtonSize
    const { props: buttonProps } = useButton(buttonBehaviorProps, {
      Text: ButtonText,
      iconSize:
        (typeof size === 'string' ? buttonIconSize[size] : undefined) ??
        buttonIconSize.md,
    })

    const frame = (
      <Theme name="Button" forceClassName>
        <ButtonFrame ref={ref} {...buttonProps} />
      </Theme>
    )

    return theme ? <Theme name={theme}>{frame}</Theme> : frame
  },
  { disableTheme: true }
)

export const Button = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Icon: ButtonIcon,
  Text: ButtonText,
})

export type ButtonProps = GetProps<typeof ButtonComponent>
