import { Text as TamaguiText, styled } from 'tamagui'

export const FontTokensInVariants = styled(TamaguiText, {
  borderRadius: 100_000_000,

  variants: {
    type: {
      H1: {
        fontFamily: '$mono',
        fontSize: '$1',
      },
      // semiBold: {
      //   fontFamily: '"Comic Sans"',
      // },
      // medium: {
      //   fontFamily: 'Garamond',
      // },
      // regular: {
      //   fontFamily: '"Comic Sans"',
      // },
    },

    // size: {
    //   normal: {
    //     fontSize: '1rem',
    //   },
    //   large: {
    //     fontSize: '1.2rem',
    //   },
    //   small: {
    //     fontSize: '0.85rem',
    //   },
    // },
  } as const,

  // defaultVariants: {
  //   type: 'regular',
  //   size: 'normal',
  // },
})
