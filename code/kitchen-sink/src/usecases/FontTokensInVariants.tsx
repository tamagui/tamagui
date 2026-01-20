import { Text as TamaguiText, styled } from 'tamagui'

export const FontTokensInVariants = styled(TamaguiText, {
  borderRadius: 100_000_000,

  variants: {
    type: {
      H1: {
        fontFamily: '$mono',
        fontSize: '$1',
      },
    },
  } as const,
})
