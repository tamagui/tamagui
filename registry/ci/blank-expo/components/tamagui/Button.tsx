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
} from 'tamagui'

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
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderRadius: 8,
  borderWidth: 1,

  $web: {
    cursor: 'pointer',
  },

  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
    opacity: 0.7,
  },

  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },

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
        borderColor: '$borderColor',
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
  color: '$color',
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
    const { props: buttonProps } = useButton(
      {
        ...props,
        size,
      },
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
