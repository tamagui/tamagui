import { Paragraph, styled } from 'tamagui'

export const Code = styled(Paragraph, {
  tag: 'code',
  fontFamily: '$mono',
  lineHeight: 18,
  whiteSpace: 'pre',
  padding: '$1',
  borderRadius: '$3',

  variants: {
    colored: {
      true: {
        color: '$color',
        backgroundColor: '$background',
      },
    },
  },
})

export const CodeInline = styled(Paragraph, {
  fontFamily: '$mono',
  theme: 'alt2',
  color: '$color',
  backgroundColor: '$background',
  br: '$1',
  lineHeight: 18,
  px: '$1',
  py: 3,
})

// const x = <Code />
