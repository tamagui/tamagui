import { Paragraph, styled } from 'tamagui'

export const LI = styled(Paragraph, {
  display: 'list-item' as any,
  pb: '1',
  render: 'li',
  size: '5',
  style: {
    listStyleType: 'disc',
  },
})
