import { Button, Text, View, styled, createStyledContext } from 'tamagui'

export function VariantsOrder() {
  return (
    <>
      <Button testID="button">
        <Text testID="text1">default</Text>
        <Text2 testID="text2">20px</Text2>
        <P testID="text3">30px</P>
        <P2 testID="text4">40px</P2>
      </Button>

      {/* Issue #3669: Variant chaining */}
      <ButtonFrame testID="frame-test-direct" test>
        <ButtonText testID="text-test-direct">direct test</ButtonText>
      </ButtonFrame>

      <ButtonFrame2 testID="frame-test2-chained" test2>
        <ButtonText testID="text-test2-chained">chained test2</ButtonText>
      </ButtonFrame2>
    </>
  )
}

export const Text2 = styled(Text, {
  fontFamily: '$body',
  fontSize: 20,
  userSelect: 'auto',

  variants: {
    bold: {
      true: {
        fontWeight: '600',
      },
    },
    center: {
      true: {
        textAlign: 'center',
      },
    },
    inherit: {
      false: {
        fontSize: 15,
      },
    },
  } as const,

  defaultVariants: {
    inherit: false,
  },
})

const P = styled(Text2, {
  fontSize: 30,
})

const P2 = styled(Text2, {
  fontSize: 30,

  variants: {
    parentVariant: {
      true: {
        fontSize: 40,
      },
    },
  } as const,

  defaultVariants: {
    parentVariant: true,
  },
})

// --- Issue #3669: Variant chaining with context ---
const TestContext = createStyledContext({
  test: false,
})

const ButtonFrame = styled(View, {
  name: 'ButtonFrame',
  context: TestContext,
  backgroundColor: 'gray',
  padding: 10,

  variants: {
    test: {
      true: {
        backgroundColor: 'red',
      },
    },
  } as const,
})

const ButtonFrame2 = styled(ButtonFrame, {
  name: 'ButtonFrame2',

  variants: {
    test2: {
      true: {
        test: true, // maps test2 → test
      },
    },
  } as const,
})

const ButtonText = styled(Text, {
  name: 'ButtonText',
  context: TestContext,
  color: 'black',

  variants: {
    test: {
      true: {
        color: 'white',
      },
    },
  } as const,
})
