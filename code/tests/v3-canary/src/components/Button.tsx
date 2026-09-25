// a custom skin over the button behavior primitives. each control owns its
// size table inline: `sm` and `md` are rows of token keys, so the frame,
// text and icon agree by construction.
import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  createStyledHOC,
  getThemedIconSize,
  createStyledContext,
  styled,
  useButton,
  withStaticProperties,
} from 'tamagui'

type ButtonSize = 'sm' | 'md'

const ButtonContext = createStyledContext<{ size?: ButtonSize }>({ size: 'md' })

const buttonFrameSize = {
  sm: { paddingInline: '3', paddingBlock: '1.5', rounded: 'md', gap: '1.5' },
  md: { paddingInline: '4', paddingBlock: '2', rounded: 'md', gap: '2' },
} as const

const buttonTextSize = {
  sm: { fontSize: 'sm', lineHeight: 'sm' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
} as const

// control heights (line height plus vertical padding) plus the frame's 1px
// border on each side
const buttonHeight = {
  sm: 34,
  md: 38,
} as const

const buttonIconSize = {
  sm: 16,
  md: 16,
} as const

const resolveButtonSize = (size: ButtonSize | undefined): keyof typeof buttonHeight =>
  typeof size === 'string' && size in buttonHeight
    ? (size as keyof typeof buttonHeight)
    : 'md'

const ButtonFrameBase = styled(ButtonBehaviorFrame, {
  context: ButtonContext,
  displayName: 'CanaryButtonFrame',
  bg: 'canaryTheme',
  borderColor: 'canary-token',
  borderWidth: 1,
  cursor: 'web:pointer',
  opacity: 'hover:0.9 press:0.7',
  outlineColor: 'focus-visible:canary-token',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: buttonFrameSize,
    circular: styled.dynamic<boolean>(),
    disabled: {
      true: { opacity: 0.35 },
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const ButtonFrame = ButtonFrameBase.resolve((props) => {
  if (!props.circular) {
    return { minHeight: buttonHeight[resolveButtonSize(props.size as ButtonSize)] }
  }
  // the control height plus the 1px border on each side
  const side = buttonHeight[resolveButtonSize(props.size as ButtonSize)]
  return {
    rounded: 1000,
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
  displayName: 'CanaryButtonText',
  color: 'white',
  fontWeight: '600',
  variants: {
    size: buttonTextSize,
  } as const,
  defaultVariants: { size: 'md' },
})

const ButtonComponent = createStyledHOC(
  ButtonFrame,
  function CanaryButton(props: ButtonBehaviorProps & { size?: ButtonSize }, ref) {
    const { props: buttonProps } = useButton(props, {
      Text: ButtonText,
      iconSize: getThemedIconSize(
        buttonIconSize[resolveButtonSize(props.size as ButtonSize)]
      ),
    })

    return <ButtonFrame ref={ref} {...buttonProps} />
  }
)

export const Button = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Text: ButtonText,
})
