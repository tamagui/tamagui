import { GetProps, Text as TamaguiText, styled } from '@tamagui/core'

const Text = styled(TamaguiText, {
  name: 'Text',
  fontFamily: '$body',
  color: '$color',

  variants: {
    size: {
      sm: {
        fontSize: '$5',
      },
      md: {
        fontSize: '$4',
      },
      xl: {
        fontSize: '$4',
      },
    },
    underlined: {
      true: {
        textDecorationLine: 'underline',
      },
    },
  } as const,
})

export type TextProps = GetProps<typeof Text>

export default Text
