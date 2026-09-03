// a custom skin over the button behavior primitives, sized by the config's
// named sizes rather than a table of its own: `sm` and `md` are recipes of
// tokens read through resolveSize, so the frame, text and icon agree.
import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  createStyledHOC,
  getThemedIconSize,
  resolveSize,
  SizeContext,
  styled,
  useButton,
  withStaticProperties,
} from 'tamagui'

import type { CanaryConfig } from '../../tamagui.config'

type ButtonSize = Exclude<keyof CanaryConfig['sizes'], 'default'>

const ButtonFrameBase = styled(ButtonBehaviorFrame, {
  context: SizeContext,
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
    size: styled.dynamic<ButtonSize>((val, env) => resolveSize(val, env).frame),
    circular: styled.dynamic<boolean>(),
    disabled: {
      true: { opacity: 0.35 },
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const ButtonFrame = ButtonFrameBase.resolve((props, env) => {
  if (!props.circular) return
  // the control height plus the 1px border on each side
  const side = resolveSize(props.size as ButtonSize | undefined, env).controlHeight + 2
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
  context: SizeContext,
  displayName: 'CanaryButtonText',
  color: 'white',
  fontWeight: '600',
  variants: {
    size: styled.dynamic<ButtonSize>((val, env) => resolveSize(val, env).text),
  } as const,
  defaultVariants: { size: 'md' },
})

const ButtonComponent = createStyledHOC(
  ButtonFrame,
  function CanaryButton(props: ButtonBehaviorProps & { size?: ButtonSize }, ref) {
    const size = props.size ?? 'md'
    const { props: buttonProps } = useButton(
      { ...props, size },
      { Text: ButtonText, iconSize: getThemedIconSize(size) }
    )

    return (
      <SizeContext.Provider size={size}>
        <ButtonFrame ref={ref} {...buttonProps} />
      </SizeContext.Provider>
    )
  }
)

export const Button = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Text: ButtonText,
})
