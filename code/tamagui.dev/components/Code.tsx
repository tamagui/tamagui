import { Paragraph, styled } from 'tamagui'

export const Code = styled(Paragraph, {
  name: 'Code',
  render: 'code',
  fontFamily: '$mono',
  size: '$3',
  lineHeight: 18,
  cursor: 'inherit',
  whiteSpace: 'pre',
  p: '$1',
  rounded: '$4',

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
  render: 'code',
  fontFamily: '$mono',
  color: '$color12',
  backgroundColor: '$color4',
  cursor: 'inherit',
  rounded: '$3',
  // @ts-ignore
  fontSize: '90%',
  // @ts-ignore
  lineHeight: '70%',
  px: '0.6%',
  py: '0.45%',
  mx: '-0.1%',
  whiteSpace: 'pre',
})
