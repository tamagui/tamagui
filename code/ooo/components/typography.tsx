import { Paragraph, styled } from 'tamagui'

export const PrettyText = styled(Paragraph, {
  className: 'pretty-text',
  textWrap: 'pretty',
  theme: 'yellow',
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
  letterSpacing: -0.4,
  fontSize: 18,
  lineHeight: 30,
  className: '',
  color: '$color12',
  $gtSm: {
    fontSize: 23,
    lineHeight: 38,
  },
})

export const PrettyTextBiggest = styled(PrettyText, {
  // fontFamily: 'Perfectly Nineties',
  fontSize: 100,
  lineHeight: 100,
  fontWeight: '500',
  color: '$color11',
  paddingBottom: 20,

  $sm: {
    fontSize: 58,
    lineHeight: 62,
  },

  $xs: {
    fontSize: 48,
    lineHeight: 58,
  },
})
