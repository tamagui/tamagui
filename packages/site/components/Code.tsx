import { Paragraph, styled } from 'tamagui'

export const Code = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
  size: '$4',
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
  theme: 'alt1',
  color: '$color',
  backgroundColor: '$background',
  br: '$4',
  size: '$4',
  px: '$1',
  py: 3,
})

// const x = <Code />
