import { Paragraph, styled } from '@tamagui/ui'

export const LI = styled(Paragraph, {
  display: 'list-item' as any,
  tag: 'li',
  size: '$5',
  pb: '$1',
  style: {
    listStyleType: 'disc',
  },
})
