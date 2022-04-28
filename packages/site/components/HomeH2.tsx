import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  ta: 'center',
  als: 'center',
  letterSpacing: -6,
  size: '$13',
  maw: 780,

  $sm: {
    size: '$9',
    letterSpacing: -1,
  },
})

export const HomeH3 = styled(H3, {
  debug: 'verbose',
  ta: 'center',
  theme: 'alt4',
  als: 'center',
  fow: '400',
  size: '$9',
  letterSpacing: -1.5,
  maw: 570,

  $sm: {
    size: '$6',
    fontWeight: '400',
  },
})
