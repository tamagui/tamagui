import { Paragraph, styled } from '@tamagui/ui'

export const Code = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
  size: '$3',
  lineHeight: 18,
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
  color: '$color12',
  backgroundColor: '$color3',
  cursor: 'inherit',
  br: '$3',
  // @ts-ignore
  fontSize: '90%',
  // @ts-ignore
  lineHeight: '80%',
  px: '0.6%',
  py: '0.8%',
  mx: '-0.1%',
  whiteSpace: 'pre',
})
