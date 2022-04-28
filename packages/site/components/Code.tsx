import { Paragraph, styled } from 'tamagui'

export const Code = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
  lineHeight: 21,
  fontSize: 15,
  whiteSpace: 'pre',
  padding: '$1',
  borderRadius: '$4',

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
  name: 'CodeInline',
  tag: 'code',
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
