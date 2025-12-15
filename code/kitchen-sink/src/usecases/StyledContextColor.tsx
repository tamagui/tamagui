import {
  Button,
  GetProps,
  SizableText,
  ThemeableStack,
  createStyledContext,
  styled,
  useProps,
} from 'tamagui'

// Reproduce GitHub issue #3676 - Context Values Not Accessible in Children Styles
// Parent component style properties like `color` cannot be accessed by child components

// Create a custom button with styled context
export const CustomButtonContext = createStyledContext<{
  size?: any
  color?: string
}>({
  size: '$4',
  color: undefined,
})

const CustomButtonFrame = styled(ThemeableStack, {
  name: 'CustomButton',
  context: CustomButtonContext,
  render: 'button',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  cursor: 'pointer',
  padding: '$3',
  borderRadius: '$4',
  backgroundColor: '$background',

  variants: {
    color: {
      green: {
        // This should propagate to children via context
        color: 'green',
      },
      red: {
        color: 'red',
      },
      blue: {
        color: 'blue',
      },
    },
  } as const,
})

const CustomButtonText = styled(SizableText, {
  name: 'CustomButtonText',
  context: CustomButtonContext,

  variants: {
    color: {
      green: {
        color: 'green',
      },
      red: {
        color: 'red',
      },
      blue: {
        color: 'blue',
      },
    },
  } as const,
})

// This is the key pattern from issue #3676 - using $color to reference context value
// The child should use $color to reference the parent's color value from context
const ContextRefButtonFrame = styled(ThemeableStack, {
  name: 'ContextRefButton',
  context: CustomButtonContext,
  render: 'button',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  cursor: 'pointer',
  padding: '$3',
  borderRadius: '$4',
  backgroundColor: '$background',

  variants: {
    variant: {
      link: {
        // Sets color in context via variant - this is the issue!
        // The variant's color should propagate to context and children should receive it
        color: 'green',
        hoverStyle: { color: 'red' },
      },
      primary: {
        color: 'blue',
      },
    },
  } as const,
})

// Child that references parent's context color using $color syntax
// This pattern mimics ButtonText which uses `color: '$color'` to inherit from parent
const ContextRefButtonText = styled(SizableText, {
  name: 'ContextRefButtonText',
  context: CustomButtonContext,

  variants: {
    // Using unstyled pattern like ButtonText does
    unstyled: {
      false: {
        // This $color should reference the parent's color value from context
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

type CustomButtonProps = GetProps<typeof CustomButtonFrame> & {
  children?: React.ReactNode
}

const CustomButtonComponent = CustomButtonFrame.styleable<CustomButtonProps>(
  function CustomButton(props, ref) {
    const { children, ...rest } = props
    return (
      <CustomButtonFrame {...rest} ref={ref}>
        <CustomButtonText>{children}</CustomButtonText>
      </CustomButtonFrame>
    )
  }
)

type ContextRefButtonProps = GetProps<typeof ContextRefButtonFrame> & {
  children?: React.ReactNode
}

const ContextRefButtonComponent = ContextRefButtonFrame.styleable<ContextRefButtonProps>(
  function ContextRefButton(props, ref) {
    const { children, ...rest } = props
    return (
      <ContextRefButtonFrame {...rest} ref={ref}>
        <ContextRefButtonText>{children}</ContextRefButtonText>
      </ContextRefButtonFrame>
    )
  }
)

// Issue #3670 - pressStyle color not propagating to children
// Button with pressStyle that changes color - should propagate to text on press
// Note: This only works with animation drivers that re-render on press (not CSS driver)
const PressStyleButtonFrame = styled(ThemeableStack, {
  name: 'PressStyleButton',
  context: CustomButtonContext,
  render: 'button',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  cursor: 'pointer',
  padding: '$3',
  borderRadius: '$4',
  backgroundColor: '$background',
  color: 'green',

  pressStyle: {
    // @ts-ignore TODO
    color: 'red',
  },
})

const PressStyleButtonText = styled(SizableText, {
  name: 'PressStyleButtonText',
  context: CustomButtonContext,

  variants: {
    color: {
      green: { color: 'green' },
      red: { color: 'red' },
    },
  } as const,
})

type PressStyleButtonProps = GetProps<typeof PressStyleButtonFrame> & {
  children?: React.ReactNode
}

const PressStyleButtonComponent = PressStyleButtonFrame.styleable<PressStyleButtonProps>(
  function PressStyleButton(props, ref) {
    const { children, ...rest } = props
    return (
      <PressStyleButtonFrame {...rest} ref={ref}>
        <PressStyleButtonText>{children}</PressStyleButtonText>
      </PressStyleButtonFrame>
    )
  }
)

export function StyledContextColor() {
  return (
    <>
      {/* Test 1: Using the standard Button with color prop */}
      <Button testID="standard-button-green" color="green">
        Standard Button Green
      </Button>

      {/* Test 2: Custom button with color variant - should propagate to text */}
      <CustomButtonComponent testID="custom-button-green" color="green">
        Custom Button Green
      </CustomButtonComponent>

      <CustomButtonComponent testID="custom-button-red" color="red">
        Custom Button Red
      </CustomButtonComponent>

      {/* Test 3: Manual context provider */}
      <CustomButtonContext.Provider color="blue">
        <CustomButtonFrame testID="context-frame-blue">
          <CustomButtonText testID="context-text-blue">
            Context Provided Blue
          </CustomButtonText>
        </CustomButtonFrame>
      </CustomButtonContext.Provider>

      {/* Test 4: Issue #3676 - $color reference should get parent's color from context */}
      {/* Direct color prop - this should work like Button */}
      <CustomButtonContext.Provider color="green">
        <ContextRefButtonFrame testID="context-ref-button-link">
          <ContextRefButtonText testID="context-ref-text-link">
            Context Ref Link Text (via Provider)
          </ContextRefButtonText>
        </ContextRefButtonFrame>
      </CustomButtonContext.Provider>

      {/* Using variant to set color - this is the problematic case */}
      <ContextRefButtonComponent testID="context-ref-button-primary" variant="primary">
        Context Ref Primary Button (via variant)
      </ContextRefButtonComponent>

      {/* Test 5: Issue #3670 - pressStyle color should propagate to children on press */}
      {/* Note: Requires disableClassName to force runtime press handling */}
      <PressStyleButtonComponent testID="press-style-button" disableClassName>
        Press Style Button (green → red on press)
      </PressStyleButtonComponent>
    </>
  )
}
