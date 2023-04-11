import { Text, styled } from 'tamagui'

export function SandboxVariantFontFamily() {
  return (
    <Heading type="myVariant" fontSize="$8">
      H1
    </Heading>
  )
}

export const Heading = styled(Text, {
  name: 'Heading',
  color: '$color',

  variants: {
    type: {
      myVariant: {
        fontFamily: '$body',
        fontSize: 20,
        lh: '$24',
        fow: '$bold',
      },
    },
  } as const,
})
