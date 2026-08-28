import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { SizableText } from './SizableText'

export const Paragraph = styled(SizableText, {
  displayName: 'Paragraph',
  className: 'is_Paragraph',
  render: 'p',
  userSelect: 'auto',
  color: 'color',
  whiteSpace: 'normal',
  size: true,
})

export type ParagraphProps = GetProps<typeof Paragraph>
