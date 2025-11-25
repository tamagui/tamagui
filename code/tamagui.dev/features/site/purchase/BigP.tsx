import { Paragraph, styled } from 'tamagui'

export const P = styled(Paragraph, {
  fontFamily: '$mono',
  size: '$4',
  lineHeight: '$5',
  $gtXs: {
    px: '$8',
    size: '$6',
    lineHeight: '$7',
  },
})

export const BigP = styled(P, {
  theme: 'green',
  size: '$5',
  lineHeight: '$6',
  $gtXs: {
    px: '$8',
    size: '$8',
    lineHeight: '$9',
  },
  color: '$color11',
})
