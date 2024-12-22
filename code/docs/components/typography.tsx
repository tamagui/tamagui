import { Paragraph, styled } from 'tamagui'

export const PrettyText = styled(Paragraph, {
  textWrap: 'balanced' as any,
  color: '$color12',
  fontSize: '$6',
  lineHeight: '$7',
})

export const PrettyTextMedium = styled(PrettyText, {
  fontSize: '$5',
  lineHeight: '$5',
})

export const PrettyTextBigger = styled(PrettyText, {
  my: 5,
  fontSize: 18,
  lineHeight: 30,
  ls: -0.1,
  className: '',
  color: '$color12',

  $gtSm: {
    fontSize: 24,
    lineHeight: 42,
  },

  variants: {
    intro: {
      true: {
        color: '$color11',

        '$theme-dark': {
          color: '$color11',
        },
      },
    },

    subtle: {
      true: {
        color: '$color11',
      },
    },
  } as const,
})

export const PrettyTextBiggest = styled(PrettyText, {
  fontFamily: '$perfectlyNineties',
  textWrap: 'pretty',
  fontSize: 100,
  lineHeight: 110,
  fontWeight: '500',
  color: '$color11',
  paddingBottom: 20,

  $md: {
    fontSize: 95,
    lineHeight: 100,
  },

  $sm: {
    fontSize: 58,
    lineHeight: 62,
  },

  $xs: {
    fontSize: 48,
    lineHeight: 58,
  },
})
