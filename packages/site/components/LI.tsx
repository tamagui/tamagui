import { Paragraph, styled } from 'tamagui'

export const LI = styled(Paragraph, {
  // @ts-ignore
  display: 'list-item',
  tag: 'li',
  pb: '$1',
})
