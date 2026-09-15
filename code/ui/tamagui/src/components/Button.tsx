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
  getSizing,
  resolveSizing,
  styled,
  Theme,
  type SizeName,
  type ThemeProps,
  withStaticProperties,
} from '@tamagui/core'

export type ButtonSize = SizeName | boolean

const ButtonContext = createStyledContext<{ size?: ButtonSize }>({ size: 'md' })

// frame geometry derives from the config sizing ladder: rung token keys for
// padding, radius, and gap, the control height plus the frame 1px border on
// each side for min height so text buttons end up as tall as circular ones
const buttonFrameSize = styled.dynamic<ButtonSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  return {
    paddingInline: sizing.paddingInline,
    paddingBlock: sizing.paddingBlock,
    borderRadius: sizing.radius,
    gap: sizing.gap,
    // an icon-only button has a 16px content box where a labelled one has a
    // 20px line box, so without this the two misalign by 4px
    minHeight: sizing.height + 2,
    // `size` is a control preset, not square geometry. keep the frame width
    // content-driven even if an outer styled layer also recognizes `size` as
    // the generic width/height shorthand.
    width: 'auto',
  }
})

const buttonTextSize = styled.dynamic<ButtonSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  return { fontSize: sizing.fontSize, lineHeight: sizing.lineHeight }
})

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
    size: buttonFrameSize,

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

export const ButtonFrame = ButtonFrameBase.resolve((props, env) => {
  if (!props.circular) return
  // the control height plus the frame's 1px border on each side
  const side = resolveSizing(props.size as ButtonSize, env).height + 2
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
    size: buttonTextSize,
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ButtonIcon = ({ size, ...props }: ButtonBehaviorIconProps) => {
  const context = ButtonContext.useStyledContext()

  return <ButtonBehaviorIcon {...props} size={size ?? getSizing(context?.size).icon} />
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
      iconSize: getSizing(size).icon,
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
