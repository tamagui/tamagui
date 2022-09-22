import { Paragraph, styled } from 'tamagui'

export const Code = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
  lineHeight: 20,
  size: '$3',
  cursor: 'inherit',
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
  } as const,
})

export const CodeInline = styled(Paragraph, {
  name: 'CodeInline',
  tag: 'code',
  fontFamily: '$mono',
  color: '$colorHover',
  backgroundColor: '$background',
  cursor: 'inherit',
  br: '$3',
  fontSize: 'inherit',
  p: '$1.5',
})
