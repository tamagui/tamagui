import { Button, Text, styled } from 'tamagui'

export function VariantsOrder() {
  return (
    <Button testID="button">
      <Text testID="text1">default</Text>
      <Text2 testID="text2">20px</Text2>
      <P testID="text3">30px</P>
      <P2 testID="text4">40px</P2>
    </Button>
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
  },

  defaultVariants: {
    parentVariant: true,
  },
})
