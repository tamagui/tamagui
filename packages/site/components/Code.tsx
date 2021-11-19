import { Paragraph, styled } from 'tamagui'

export const Code = styled(Paragraph, {
  tag: 'code',
  fontFamily: '$mono',
  fontSize: 13,
  lineHeight: 18,
  whiteSpace: 'pre',
  padding: 4,
  borderRadius: 4,

  variants: {
    colored: {
      true: {
        color: '$pink11',
        backgroundColor: '$pink3',
      },
    },
  },
})
