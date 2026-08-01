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
  createSizeTable,
  createStyledHOC,
  type GetProps,
  styled,
  useButton,
  withStaticProperties,
} from '@tamagui/ui'

export const buttonSizes = createSizeTable(
  {
    small: {
      frame: {
        gap: 6,
        height: 30,
        paddingHorizontal: 10,
      },
      text: {
        fontSize: 13,
        lineHeight: 18,
      },
      icon: 14,
    },
    medium: {
      frame: {
        gap: 8,
        height: 36,
        paddingHorizontal: 14,
      },
      text: {
        fontSize: 15,
        lineHeight: 20,
      },
      icon: 16,
    },
    large: {
      frame: {
        gap: 10,
        height: 44,
        paddingHorizontal: 18,
      },
      text: {
        fontSize: 17,
        lineHeight: 24,
      },
      icon: 20,
    },
    wide: {
      frame: {
        gap: 10,
        height: 44,
        minWidth: 180,
        paddingHorizontal: 24,
      },
      text: {
        fontSize: 16,
        lineHeight: 22,
      },
      icon: 18,
    },
  } as const,
  'medium'
)

export type ButtonSize = keyof typeof buttonSizes.values

export const ButtonFrame = styled(ButtonBehaviorFrame, {
  context: buttonSizes.Context,
  name: 'ButtonFrame',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover',
  borderRadius: 8,
  borderWidth: 1,
  cursor: 'web:pointer',
  opacity: 'press:0.7',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: buttonSizes.frame,

    circular: {
      true: {
        borderRadius: 1000,
        paddingHorizontal: 0,
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
    size: 'medium',
  },
  compoundVariants: [
    {
      size: 'small',
      circular: true,
      style: {
        maxHeight: 30,
        maxWidth: 30,
        minWidth: 30,
        width: 30,
      },
    },
    {
      size: 'medium',
      circular: true,
      style: {
        maxHeight: 36,
        maxWidth: 36,
        minWidth: 36,
        width: 36,
      },
    },
    {
      size: 'large',
      circular: true,
      style: {
        maxHeight: 44,
        maxWidth: 44,
        minWidth: 44,
        width: 44,
      },
    },
    {
      size: 'wide',
      circular: true,
      style: {
        maxHeight: 44,
        maxWidth: 44,
        minWidth: 44,
        width: 44,
      },
    },
  ],
})

export const ButtonText = styled(ButtonBehaviorText, {
  context: buttonSizes.Context,
  name: 'ButtonText',
  color: 'color',
  fontWeight: '600',
  userSelect: 'none',
  variants: {
    size: buttonSizes.text,
  } as const,
  defaultVariants: {
    size: 'medium',
  },
})

export const ButtonIcon = ({ size, ...props }: ButtonBehaviorIconProps) => {
  const context = buttonSizes.Context.useStyledContext()
  const namedSize = context?.size ?? buttonSizes.defaultSize

  return (
    <ButtonBehaviorIcon {...props} size={size ?? buttonSizes.resolve(namedSize).icon} />
  )
}

const ButtonComponent = createStyledHOC(ButtonFrame)<ButtonBehaviorProps>(
  function Button(props, ref) {
    const size = (props.size ?? buttonSizes.defaultSize) as ButtonSize
    // Size is the frame's baseline contribution. Appending it after
    // HOC-expanded style props would let the variant overwrite a direct
    // padding override from the caller.
    const sizedProps = { size, ...props }
    const { props: buttonProps } = useButton(
      sizedProps,
      {
        Text: ButtonText,
        iconSize: buttonSizes.resolve(size).icon,
      }
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
  Icon: ButtonIcon,
  Text: ButtonText,
})

export type ButtonProps = GetProps<typeof ButtonComponent>
