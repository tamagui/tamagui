import { PropTypes, styled } from '@tamagui/core'

import { SizableText } from './SizableText'

export const Paragraph = styled(SizableText, {
  name: 'Paragraph',
  tag: 'p',
  selectable: true,
  cursor: 'text',

  // TODO adding fontWeight here doesn't override SizableText variant
  // should pass it in as default prop
})

export type ParagraphProps = PropTypes<typeof Paragraph>
