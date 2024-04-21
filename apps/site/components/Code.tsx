import { Paragraph, styled } from 'tamagui'

export const Code = styled(
  Paragraph,
  {
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
  },
  {
    name: 'Code',
  }
)

export const CodeInline = styled(
  Paragraph,
  {
    tag: 'code',
    fontFamily: '$mono',
    color: '$color12',
    backgroundColor: '$color3',
    cursor: 'inherit',
    br: '$3',
    // @ts-ignore
    fontSize: '85%',
    p: '$1.5',
    whiteSpace: 'pre',
  },
  {
    name: 'CodeInline',
  }
)
