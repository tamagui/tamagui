import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'

import { SizableText } from './SizableText'

export const Paragraph = styled(
  SizableText,
  {
    tag: 'p',
    userSelect: 'auto',
    color: '$color',
    size: '$true',
    whiteSpace: 'normal',
  },
  {
    name: 'Paragraph',
  }
)

export type ParagraphProps = GetProps<typeof Paragraph>
