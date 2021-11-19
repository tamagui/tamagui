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
        color: '$color2',
        backgroundColor: '$bg4',
      },
    },
  },
})
