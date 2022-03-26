import { PropTypes, styled } from '@tamagui/core'

import { SizableText } from './SizableText'

export const Paragraph = styled(SizableText, {
  name: 'Paragraph',
  size: '$4',
  selectable: true,
  cursor: 'text',
})

export type ParagraphProps = PropTypes<typeof Paragraph>
