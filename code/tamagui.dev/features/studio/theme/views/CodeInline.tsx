import { Paragraph, styled } from 'tamagui'

// @ts-ignore
export const CodeInline = styled(Paragraph, {
  name: 'CodeInline',
  render: 'code',
  fontFamily: '$mono',
  backgroundColor: '$color02',
  cursor: 'inherit',
  rounded: '$3',
  fontSize: '85%',
  p: '$1.5',
})
