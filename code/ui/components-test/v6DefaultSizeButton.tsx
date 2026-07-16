import {
  ButtonFrame as ButtonBehaviorFrame,
  ButtonText as ButtonBehaviorText,
  type ButtonBehaviorProps,
  useButton,
} from '@tamagui/button'
import {
  createSizeTable,
  createStyledHOC,
  styled,
  withStaticProperties,
} from '@tamagui/core'

const buttonSizes = createSizeTable(
  {
    default: {
      frame: {
        borderRadius: '$4',
        height: '$11',
        paddingHorizontal: '$4',
      },
      text: {
        fontSize: '$4',
        lineHeight: '$4',
      },
      icon: '$4',
    },
    $11: {
      frame: {
        borderRadius: '$11',
        height: '$11',
        paddingHorizontal: '$11',
      },
      text: {
        fontSize: '$11',
        lineHeight: '$11',
      },
      icon: '$11',
    },
  } as const,
  'default'
)

type ButtonSize = keyof typeof buttonSizes.values

const ButtonFrame = styled(ButtonBehaviorFrame, {
  context: buttonSizes.Context,
  name: 'V6DefaultSizeTestButtonFrame',

  variants: {
    size: buttonSizes.frame,
  } as const,

  defaultVariants: {
    size: 'default',
  },
})

const ButtonText = styled(ButtonBehaviorText, {
  context: buttonSizes.Context,
  name: 'V6DefaultSizeTestButtonText',

  variants: {
    size: buttonSizes.text,
  } as const,

  defaultVariants: {
    size: 'default',
  },
})

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

export const V6DefaultSizeButton = withStaticProperties(ButtonComponent, {
  Frame: ButtonFrame,
  Text: ButtonText,
})
