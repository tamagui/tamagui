import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  ta: 'center',
  als: 'center',
  letterSpacing: -2,
  size: '$10',
  maw: 500,

  $sm: {
    size: '$8',
    letterSpacing: -1,
  },
})

export const HomeH3 = styled(H3, {
  ta: 'center',
  theme: 'alt3',
  als: 'center',
  fow: '400',
  size: '$7',
  letterSpacing: -0.5,
  maw: 500,

  $sm: {
    size: '$6',
    fontWeight: '400',
  },
})
