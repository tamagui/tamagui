import { PropTypes, styled } from '@tamagui/core'

import { SizableText } from './SizableText'

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
