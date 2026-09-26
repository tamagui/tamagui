import { Paragraph, styled } from 'tamagui'

export const LI = styled(Paragraph, {
  display: 'list-item' as any,
  render: 'li',
  size: '5',
  my: '0-5',
  style: {
    listStylePosition: 'outside',
  },
})
