import { Paragraph, styled } from 'tamagui'

export const LI = styled(Paragraph, {
  display: 'list-item' as any,
  render: 'li',
  size: '$5',
  pb: '$1',
  style: {
    listStyleType: 'disc',
  },
})
