import { GetProps, styled } from '@tamagui/web'

import { SizableText } from './SizableText'

export const Paragraph = styled(SizableText, {
  name: 'Paragraph',
  tag: 'p',
  userSelect: 'auto',
  color: '$color',
  size: '$true',
})

export type ParagraphProps = GetProps<typeof Paragraph>
