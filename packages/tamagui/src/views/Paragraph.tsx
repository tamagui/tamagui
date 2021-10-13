import { PropTypes, Text, styled } from '@tamagui/core'

export const SizableText = styled(Text, {
  variants: {
    size: {
      '...size': (val, { tokens }) => {
        return {
          fontSize: tokens.fontSize[val] ?? val,
          lineHeight: tokens.lineHeight[val] ?? val,
        }
      },
    },
  },
})

export const Paragraph = styled(SizableText, {
  fontFamily: '$body',
  color: '$color',
  size: '$4',
})

export type ParagraphProps = PropTypes<typeof Paragraph>

// test types:
// const x = <Paragraph size="xxxs" hi="123" />
// const y = <Stack size="md" hi="123" abc="123" />
// const z = <Paragraph size="sm" />
