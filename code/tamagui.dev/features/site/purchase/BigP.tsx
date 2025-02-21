import { Paragraph, styled } from 'tamagui'

export const P = styled(Paragraph, {
  ff: '$mono',
  size: '$6',
  lh: '$7',
})

export const BigP = styled(P, {
  theme: 'green',
  px: '$8',
  size: '$8',
  lh: '$9',
  color: '$color11',
})
