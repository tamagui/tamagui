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

export const ButtonFrame = styled(ButtonBehaviorFrame, {
  context: buttonSizes.Context,
  name: 'CanaryButtonFrame',
  background: '$canaryTheme',
  borderColor: '$canary-token',
  rounded: 8,
  borderWidth: 1,
  $web: { cursor: 'pointer' },
  hoverStyle: { opacity: 0.9 },
  pressStyle: { opacity: 0.7 },
  focusVisibleStyle: {
    outlineColor: '$canary-token',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  variants: {
    size: buttonSizes.frame,
    circular: {
      true: { rounded: 1000, paddingHorizontal: 0 },
    },
    disabled: {
      true: { opacity: 0.35 },
    },
  } as const,
  defaultVariants: { size: 'medium' },
  compoundVariants: [
    {
      size: 'small',
      circular: true,
      style: { maxH: 30, maxW: 30, minW: 30, w: 30 },
    },
  ],
})

export const ButtonText = styled(ButtonBehaviorText, {
  context: buttonSizes.Context,
  name: 'CanaryButtonText',
  color: '$white',
  fontWeight: '600',
  variants: { size: buttonSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

const ButtonComponent = createStyledHOC(ButtonFrame)<ButtonBehaviorProps>(
  function CanaryButton(props, ref) {
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
