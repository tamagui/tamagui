import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  createSizeTable,
  createStyledHOC,
  styled,
  useButton,
  withStaticProperties,
} from 'tamagui'

export const buttonSizes = createSizeTable(
  {
    small: {
      frame: { gap: 6, height: 30, paddingHorizontal: 10 },
      text: { fontSize: 13, lineHeight: 18 },
      icon: 14,
    },
    medium: {
      frame: { gap: 8, height: 36, paddingHorizontal: 14 },
      text: { fontSize: 15, lineHeight: 20 },
      icon: 16,
    },
  } as const,
  'medium'
)

type ButtonSize = keyof typeof buttonSizes.values

const ButtonFrameBase = styled(ButtonBehaviorFrame, {
  context: buttonSizes.Context,
  displayName: 'CanaryButtonFrame',
  bg: 'canaryTheme',
  borderColor: 'canary-token',
  rounded: 8,
  borderWidth: 1,
  cursor: 'web:pointer',
  opacity: 'hover:0.9 press:0.7',
  outlineColor: 'focus-visible:canary-token',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: buttonSizes.frame,
    circular: styled.dynamic<boolean>(),
    disabled: {
      true: { opacity: 0.35 },
    },
  } as const,
  defaultVariants: { size: 'medium' },
})

export const ButtonFrame = ButtonFrameBase.resolve((props) => {
  if (!props.circular) return
  const { height } = buttonSizes.resolve(
    (props.size as ButtonSize | undefined) ?? buttonSizes.defaultSize
  ).frame
  return {
    rounded: 1000,
    paddingHorizontal: 0,
    height,
    maxHeight: height,
    maxWidth: height,
    minWidth: height,
    width: height,
  }
})

export const ButtonText = styled(ButtonBehaviorText, {
  context: buttonSizes.Context,
  displayName: 'CanaryButtonText',
  color: 'white',
  fontWeight: '600',
  variants: { size: buttonSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

const ButtonComponent = createStyledHOC(
  ButtonFrame,
  function CanaryButton(props: ButtonBehaviorProps & { size?: ButtonSize }, ref) {
    const size = (props.size ?? buttonSizes.defaultSize) as ButtonSize
    const { props: buttonProps } = useButton(
      { ...props, size },
      { Text: ButtonText, iconSize: buttonSizes.resolve(size).icon }
    )

    return (
      <buttonSizes.Context.Provider size={size}>
        <ButtonFrame ref={ref} {...buttonProps} />
      </buttonSizes.Context.Provider>
    )
  }
)

export const Button = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Text: ButtonText,
})
