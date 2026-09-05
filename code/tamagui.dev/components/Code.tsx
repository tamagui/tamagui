import { Paragraph, styled } from 'tamagui'

export const Code = styled(Paragraph, {
  displayName: 'Code',
  render: 'code',
  fontFamily: 'mono',
  lineHeight: 18,
  cursor: 'inherit',
  whiteSpace: 'pre',
  p: '1',
  rounded: '4',
  size: '3',
  variants: {
    colored: {
      true: {
        color: 'color',
        backgroundColor: 'background',
      },
    },
  } as const,
})

// @ts-ignore
export const CodeInline = styled(Paragraph, {
  displayName: 'CodeInline',
  render: 'code',
  fontFamily: 'mono',
  color: 'color12',
  backgroundColor: 'color2',
  cursor: 'inherit',
  rounded: '3',
  fontSize: '90%',
  lineHeight: '70%',
  px: '0.6%',
  py: '0.45%',
  mx: '-0.1%',
  // inline code sits in prose, so it has to wrap rather than push the page wide
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
})
