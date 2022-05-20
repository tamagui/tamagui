import { Paragraph, styled } from 'tamagui'

export const Pill = styled(Paragraph, {
  tag: 'span',
  bc: '$backgroundHover',
  py: '$1',
  px: '$4',
  br: '$10',
  zi: 100,
  als: 'center',
  color: '$colorHover',
  size: '$3',
  fow: '800',
})
