import { Button, Text, styled } from 'tamagui'

export function VariantsOrder() {
  return (
    <Button testID="button">
      <Text testID="text1">hi</Text>
      <Text2 testID="text2">hi</Text2>
      <P testID="text3">hi</P>
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
