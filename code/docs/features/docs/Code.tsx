import { Text, styled } from '@tamagui/core'

export const Code = styled(Text, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
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
    allowMultiline: {
      true: {
        whiteSpace: 'normal',
      },
    },
  } as const,
})

export const CodeInline = styled(Text, {
  name: 'CodeInline',
  tag: 'code',
  fontFamily: '$mono',
  color: '$color12',
  backgroundColor: '$color2',
  cursor: 'inherit',
  br: '$3',
  // @ts-ignore
  fontSize: '88%',
  p: '$1.5',
  whiteSpace: 'pre',
})
