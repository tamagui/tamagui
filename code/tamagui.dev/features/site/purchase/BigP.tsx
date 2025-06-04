import { Paragraph, styled } from 'tamagui'

export const P = styled(Paragraph, {
  ff: '$mono',
  size: '$4',
  lh: '$5',
  $gtXs: {
    px: '$8',
    size: '$6',
    lh: '$7',
  },
})

export const BigP = styled(P, {
  theme: 'green',
  // px: '$4',
  size: '$5',
  lh: '$6',
  $gtXs: {
    px: '$8',
    size: '$8',
    lh: '$9',
  },
  color: '$color11',
})
